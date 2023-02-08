import axios from '../../services/axios.js';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import './Register.css';
import { useHistory } from 'react-router-dom';
import { useUser } from '../contexts/user-context';
import { useAuth } from '../contexts/auth-context'
import validUser from '../../helpers/validUser';

import { bech32m } from 'bech32';
import { Buffer } from 'buffer';


function Registration() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const history = useHistory();
    const { user, setUser } = useUser();
    const { setAuthCookie } = useAuth();
    const [usernameAlert, setUsernameAlert] = useState(false);

    
    useEffect(() => {
        if (validUser(user)) {
            history.push("/home");
        }
        return () => { }
    }, [user, history])

    const isGobyInstalled = () => {
        const { chia } = window;
        return Boolean(chia && chia.isGoby);
      };
    async function handleConnect() {
        if (isGobyInstalled()) {
            try {
                const accounts = await window.chia.request({ method: "requestAccounts" });
                const address = Buffer.from(accounts?.[0], 'hex');
                const xchAddress = bech32m.encode('xch', bech32m.toWords(address));
                setUsername(xchAddress)
                } catch (err) {
                    console.log('erroor')
                    // { code: 4001, message: 'User rejected the request.' }
                }
                
            }
        }
        useEffect(() => {
            setUsername()
            return () => { }
        }, [])
        
        // const cnsl = async () => {
        //     const username = await handleConnect()
        //     console.log(username)
        //   }

        // const username = cnsl()


    async function handleSubmit(event) {
        event.preventDefault();
        await axios.post('/auth/register', {
            username: username
            }).then(function (res) {
            const token = res.data.token;
            setAuthCookie(token);
            setUser(res.data.user);
            history.push("/home");
        }).catch((err) => {
            setUsernameAlert(true);
            console.error(err)
        });
    }

    // function validateFields() {
    //     return password.length >= 8
    //         && username.length >= 5
    //         && confirmPassword.length >= 8
    //         && password === confirmPassword;
    // }

    
        
// const abcsd = async () => {
//     await xchAddress;
// }
    return (
        <div className="appRegister">
            <h1> Welcome </h1>
            <form onSubmit={handleSubmit}>
                {usernameAlert &&
                    <Alert variant="primary">
                        Username is already taken.
                    </Alert>}
                <FormGroup controlId="username">
                    <FormLabel>Username</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        disabled={true}
                    />
                </FormGroup>
                {/* {password.length < 8 && password.length !== 0 &&
                    <Alert variant="primary">
                        Password is too short. (Minimum 8 characters.)
                    </Alert>
                }
                <FormGroup controlId="password">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </FormGroup>
                {confirmPassword.length !== 0 && confirmPassword !== password &&
                    <Alert variant="primary">
                        Passwords do not match.
                    </Alert>
                }
                <FormGroup controlId="confirmPassword">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        type="password"
                    />
                </FormGroup> */}
                <Button onClick={handleConnect}>
                    Create User
                </Button>
                <Button type="submit">
                    Login
                </Button>
            </form>
        </div>
    )
}

export default Registration
