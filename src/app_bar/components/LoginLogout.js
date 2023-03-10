import React, { useRef } from 'react';
import { Button } from '@material-ui/core';
import { useAuth } from '../../pages/contexts/auth-context';
import validUser from '../../helpers/validUser';
import { useDetectOutsideClick } from '../../helpers/useDetectOutsideClick'
import { useUser } from '../../pages/contexts/user-context'
import './LoginLogout.css'
import { useHistory } from "react-router-dom";
import { useEffect, useState } from 'react';


function LoginLogout(props) {
    const history = useHistory();
    const { user } = useUser();
    const { setAuthCookie } = useAuth();
    const dropdownRef = useRef(null);
    const [show, setShow] = useDetectOutsideClick(dropdownRef, false);

    function appLogout(e) {
        e.preventDefault();
        setAuthCookie("");
    }
    async function chng() {
        await window.chia.on("accountsChanged", (accounts) => {
            setAuthCookie("")
            window.location.replace('/login')
        })
    }

    useEffect(() => {
        chng()
        return () => { }
    })
    

    if (!validUser(user)) {
        return (
        <Button href="/login" color="inherit">Login</Button>
        );
    }
    return (
        <div className="menu-container">
            <button onClick={() => setShow(!show)} className="menu-trigger">
                <span>Balance: {user.balance}</span>
                <span>{user.username}</span>
            </button>
            <nav
                ref={dropdownRef}
                className={`menu ${show ? "active" : "inactive"}`}
            >
                <ul>
                    <li>
                        <p><b>Balance: {user.balance}</b></p>
                    </li>
                    <li>
                        <a href="/">Profile</a>
                    </li>
                    <li>
                        <a onClick={appLogout} href="/login">Logout</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default LoginLogout
