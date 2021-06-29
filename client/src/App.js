import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'

function App() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <Login />
                    </Route>

                    <Route exact path="/register">
                        <Register />
                    </Route>

                    <Route exact path="/home">
                        <Home />
                    </Route>
                </Switch>
            </BrowserRouter>
        </div>
    )
}

export default App
