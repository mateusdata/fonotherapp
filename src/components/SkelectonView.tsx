import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import Skelecton from './Skelecton'
import * as  Animatable from "react-native-animatable"
import MyLoader from './myLoader'
import LoadingComponent from './LoadingComponent'

const SkelectonView = ({delay}:{delay?:any}) => {
    const [visible, setVisible] = useState(true)
    useEffect(()=>{
        setTimeout(() => {
            setVisible(false)
        }, delay? delay : 500);
    },[visible])
    if(visible){
        return null
    }
    return (
        <>
            { false ? 
                <Animatable.View animation={"bounceInLeft"} style={{ padding: 10 }}>
                    <Skelecton width="100%" />
                    <Skelecton width="100%" />
                    <Skelecton width="100%" />
                    <Skelecton width="100%" />
                    <Skelecton width="100%" />
                </Animatable.View>
                :
                <LoadingComponent />
            }
        </>
    )
}

export default SkelectonView
