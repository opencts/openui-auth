import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

function findCookieById(id) {
    const cookies = document.cookie.split(';').map(it => it.trim());
    return cookies.find(it => it.split('=')[0] === id).split('=')[1];
}

function Login() {

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        email: '', password: '', rm: false
    });

    useEffect(() => {
        console.log('Loading')
        const rmStatus = findCookieById('_auth_user_is_rm');
        if (rmStatus === 'Y') {
            const token = localStorage.getItem('_auth_token_');
            console.log(token)
            if (token) {
                fetch('http://localhost:4200/remember-me/' + token).then(r => r.json()).then(r => {
                    if (r.statusText === 'ok') {
                        if ('accessToken' in r) {
                            localStorage.setItem('_auth_token_', r.accessToken);
                        }
                        history.push('/home');
                    }
                    setLoading(false);
                })
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        document.cookie = `_auth_user_is_rm=${user.rm ? 'Y' : 'N'}`;

        const res = await fetch('http://localhost:4200/login', {
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
            if (user.rm) {
                localStorage.setItem('_auth_token_', res.accessToken);
            } else {
                sessionStorage.setItem('_auth_token_', res.accessToken);
            }
            history.push('/home');
        }

    }

    if (loading) return null;

    return (
        <div>
            <form className="card" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input type="email" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} placeholder="Email..." />
                <input type="password" placeholder="Mot de passe" value={user.password} onChange={e => setUser({ ...user, password: e.target.value })} />
                <div className="spb">
                    <span>
                        <Link>Mot de passe oublié</Link>
                    </span>
                    <div className="spb">
                        <input checked={user.rm} onChange={e => setUser({ ...user, rm: e.target.checked })} type="checkbox" style={{ width: '50px' }} />
                        <label>Remember me</label>
                    </div>
                </div>

                <button >Se connecter</button>
                <button onClick={() => {
                    history.push('/register');
                }} className="outlined" className="outlined">Créer un compte</button>
            </form>
        </div>
    )
}

export default Login
