import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const _TOKEN_SECRET = 'open-cts';

const app = express();
app.use(cors());
app.use(express.json());

await mongoose.connect('mongodb://localhost/auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const User = mongoose.model('users', new mongoose.Schema({
    email: String,
    password: String
}));

app.post('/register', async (req, res) => {
    const user = { ...req.body };
    const userFounded = await User.find({ email: user.email });
    if (userFounded.length > 0) {
        res.status(401).json({
            message: 'User already exists!'
        });
    } else {
        const hash = await bcrypt.hash(user.password, 3);
        user.password = hash;
        const newUser = new User({ ...user });
        await newUser.save();
        const accessToken = await jwt.sign({ id: newUser.id, email: newUser.email }, _TOKEN_SECRET);
        res.status(201).json({ accessToken });
    }
});

app.get('/remember-me/:token', async (req, res) => {
    const token = req.params.token;
    let decodedToken;
    try {
        decodedToken = await jwt.verify(token, _TOKEN_SECRET);
        res.status(200).json({ message: 'Token verified!', statusText: 'ok' });
    } catch (e) {
        decodedToken = await jwt.decode(token);
        console.log(decodedToken);
        const foundedUser = await User.find({ email: decodedToken.email });
        if (foundedUser.length > 0) {
            const accessToken = jwt.sign({ token: foundedUser[0].refreshToken }, _TOKEN_SECRET);
            res.status(200).json({ message: 'Token verified!', statusText: 'ok', accessToken });
        } else {
            res.status(401).json({ message: 'User not found!', statusText: 'failed' });
        }
    }
});

app.post('/login', async (req, res) => {
    const { email, password, rm } = req.body;
    const foundedUser = await User.find({ email });
    if (foundedUser.length === 0) {
        res.status(401).json({ message: 'Invalid credentials!' });
    } else {
        const [user] = foundedUser;
        const verifyStatus = await bcrypt.compare(password, user.password);
        if (!verifyStatus) {
            res.status(401).json({ message: 'Invalid credentials!' });
        } else {
            const accessToken = jwt.sign({ id: user.id, email: user.email }, _TOKEN_SECRET);
            if (rm) {
                const refreshToken = jwt.sign({ id: user.id, email: user.email }, _TOKEN_SECRET);
                user.refreshToken = refreshToken;
                await user.save();
            }
            res.status(200).json({ accessToken });
        }
    }
});
app.post('/reset-password', async (req, res) => { });

const PORT = process.env.PORT || 4200;
app.listen(PORT, _ => console.log('Server is running ...'));