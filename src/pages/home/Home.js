import React from 'react'
import './Home.css'
import Logo from './big_logo.png'

function Home() {
    return (
        <div className="home">
            <img src={Logo} alt="" />
           <a href="/blackjack"><img src='https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/en_US/games/switch/b/black-jack-switch/hero' /></a>
        </div>
    )
}

export default Home
