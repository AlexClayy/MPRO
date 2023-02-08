import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './login/Login'
import Goby from './login/Goby'
import Home from './home/Home'
import Register from './registration/Register'
import BlackJack from './blackjack/Blackjack'
import RouletteWrapper from './roulette/Roulette'
// import Slots from './slots/Slots'
import { useUser } from './contexts/user-context'

function NavRouter(props) {
    const { user, setUser } = useUser();

    return (
        <div className="navSwitch">
            <Router>
                <Switch>
                    <Route path="/login">
                        <Login onLogin={props.onLogin} />
                    </Route>
                    <Route path="/goby">
                        <Goby onLogin={props.onLogin} />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/blackjack">
                        <BlackJack />
                    </Route>
                    <Route path="/roulette">
                        <RouletteWrapper username={user.username} balance={user.balance}/>
                    </Route>
                    {/* <Route path="/slots">
                        <Slots />
                    </Route> */}
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default NavRouter
