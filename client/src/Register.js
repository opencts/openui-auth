import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function Register() {

    const history = useHistory();
    const [user, setUser] = useState({
        email: '', password: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await fetch('http://localhost:4200/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(r => r.json());

        if ('message' in res) {
            alert(res.message);
            setUser({
                email: '',
                password: ''
            })
        } else {
            sessionStorage.setItem('_auth_token_', res.accessToken);
            history.push('/home');
        }

    }

    return (
        <div>
            <form className="card" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} placeholder="Email..." />
                <input type="password" placeholder="Mot de passe" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />

                <button type="submit">Créer votre compte</button>
                <button onClick={() => {
                    history.push('/');
                }} className="outlined">Se connecter</button>
            </form>
        </div>
    )
}

export default Register
