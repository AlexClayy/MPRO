import React, { useEffect } from 'react'
import { useUser } from '../contexts/user-context.js'
import updateBalance from '../../helpers/updateBalance.js'

export default function Rendering(props) {
    
    useEffect(async () => {
        let crrnt = props.winnigs
        if (crrnt > 0) {
            console.log('You win:',crrnt, "effect called")
        }
    }, [])

    return(
        <>
        </>
    )
}
