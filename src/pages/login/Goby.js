import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import React from "react";
import Login from "../components/Login.js";
import UserInfo from "../components/UserInfo.js";
import axios from "axios";
import { bech32m } from 'bech32';
import { Buffer } from 'buffer';

function Goby() {
  // const [loginVisible, setLoginVisible] = useState(false);
  // // const [user, setUser] = useState(false)
  // const [account, setAccount] = useState(null);
  // const handleLogin = () => {
  //   setLoginVisible(false);
  //   // setUser(true)
  // };
  const isGobyInstalled = () => {
    const { chia } = window;
    return Boolean(chia && chia.isGoby);
  };
  // const init = async () => {
  //   if (isGobyInstalled()) {
  //     window.chia.on("accountsChanged", (accounts) => {
  //       setAccount(
  //         accounts === null || accounts === void 0 ? void 0 : accounts[0]
  //       );
  //     });
  //     window.chia.on("chainChanged", () => window.location.reload());
  //     window.chia.request({ method: "accounts" }).then((accounts) => {
  //       setAccount(
  //         accounts === null || accounts === void 0 ? void 0 : accounts[0]
  //       );
  //     });
  //   }
  // };
  // const handleConnect = async () => {
  //   if (isGobyInstalled()) {
  //     const accounts = await window.chia.request({ method: "requestAccounts" });
  //     //   const mongo = await axios.get('http://localhost:5000/users').then(res => {
  //     //     return res.data.name;
  //     // })
  //     setAccount(
  //       accounts === null || accounts === void 0 ? void 0 : accounts[0]
  //     );
  //   } else {
  //     setLoginVisible(true);
  //   }
  // };
  // useEffect(() => {
  //   init();
  // }, []);
  const handleConnect = async () => {
    if (isGobyInstalled()) {
  try {
    const accounts = await window.chia.request({ method: "requestAccounts" });
    const address = Buffer.from(accounts?.[0], 'hex');
    const xchAddress = bech32m.encode('xch', bech32m.toWords(address));
    console.log(xchAddress)
      } catch (err) {
        console.log('erroor')
          // { code: 4001, message: 'User rejected the request.' }
      }
    }
    }


  return (
    <div className="applogin">
        <h1>Welcome</h1>
      <header className="flex-none py-[8px] container flex items-center justify-between">
        <a href="/" className="w-[105px] h-[35px]">
          <img src="" />
        </a>

        {/* {account ? <UserInfo account={!account} /> :  */}
        <Button onClick={handleConnect} className="btn-theme-color" size="large" type="primary">
          Connect wallet
        </Button>
        {/* <Button onClick={mongoPost} className="btn-theme-color" size="large" type="primary">
          Mongo Get
        </Button> */}
      </header>

      {/* <div className="flex-1 container">
        <Donate account={account} />
      </div> */}

      {/* <Login onSuccess={handleLogin} visible={loginVisible} onCancel={() => setLoginVisible(false)} /> */}
    </div>
  );
}

export default Goby
