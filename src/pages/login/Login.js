import React, { useEffect, useState } from "react";
import {
  Button,
  FormGroup,
  FormControl,
  FormLabel,
  Alert,
} from "react-bootstrap";
import "./Login.css";
import { useUser } from "../contexts/user-context";
import { useHistory } from "react-router-dom";
import validUser from "../../helpers/validUser";
import axios from "../../services/axios.js";
import { bech32m } from "bech32";
import { Buffer } from "buffer";
import { useAuth } from "../contexts/auth-context";

function Login(props) {
  const [username, setUsername] = useState("");
  const [loginAlert, setLoginAlert] = useState("");
  const history = useHistory();
  const { user } = useUser();
  const [usernameAlert, setUsernameAlert] = useState(false);
  const { setAuthCookie } = useAuth();

  function validateFormFields() {
    return username.length >= 1;
  }

  useEffect(() => {
    if (validUser(user)) {
      setUsernameAlert(true);
      history.push("/home");
    }
    return () => {};
  }, [user, history]);

  const isGobyInstalled = () => {
    const { chia } = window;
    return Boolean(chia && chia.isGoby);
  };
  async function handleConnect(e) {
    e.preventDefault();
    if (isGobyInstalled()) {
      try {
        const accounts = await window.chia.request({
          method: "requestAccounts",
        });
        const address = Buffer.from(accounts?.[0], "hex");
        const xchAddress = bech32m.encode("xch", bech32m.toWords(address));
        await axios
          .post("/auth/register", {
            username: xchAddress,
          })
          .then(function (res) {
            const token = res.data.token;
            setUsername(xchAddress);
            setUsernameAlert(true);
          })
          .catch((err) => {
            setUsername(xchAddress);
            setUsernameAlert(true);
            console.error(err);
          });
      } catch (err) {
        console.log("erroor");
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  }

  // useEffect(() => {
  //     if (validUser(user)) {
  //         setLoginAlert("");
  //         history.push('/home');
  //     }
  //     return () => { }
  // }, [user, history])

  // useEffect(() => {
  //     setUsernameAlert(false);
  //     return () => { }
  // }, [username])

  async function handleSubmit() {
    props.onLogin(username);
    await axios
      .post("/auth/login", {
        username: username,
      })
      .then(function (res) {
        // console.log(res);
      })
      .catch((err) => {
        setUsernameAlert(true);
      });
  }

  async function login() {
    function stringToHex(string) {
      const bytes = new TextEncoder().encode(string);
      return (
        "0x" +
        Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
      );
    }
    window.chia
      .request({ method: "getPublicKeys" })
      .then(function (publicKeys) {
        const message = "hello chia";
        const hexMessage = stringToHex(message);
        const params = {
          publicKey: publicKeys[0],
          message: hexMessage,
        };
        window.chia
          .request({ method: "signMessage", params })
          .then(handleSubmit);
      });
  }

  return (
    <div className="appLogin">
      <h1> Welcome to Gambit! </h1>
      <form>
        {loginAlert.length > 0 && <Alert variant="primary">{loginAlert}</Alert>}
        {/* {usernameAlert &&
                    <Alert variant="primary">
                        Username or password error.
                    </Alert>
                } */}
        {/* <FormGroup controlId="username">
                    <FormLabel>Username</FormLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={valueas}
                        onChange={e => setUsername(e.target.value)}
                    />
                </FormGroup> */}

        {/* <FormGroup controlId="password">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </FormGroup> */}
        {!usernameAlert && (
          <Button onClick={handleConnect} type="submit">
            Connect Wallet
          </Button>
        )}
        {usernameAlert && (
          <Button block disabled={!validateFormFields()} onClick={login}>
            Sign In
          </Button>
        )}
        {/* <Button block href="/register">
                    Sign Up
                </Button> */}
      </form>
    </div>
  );
}

export default Login;
