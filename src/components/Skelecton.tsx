import React from "react"
import  { Rect,Facebook, Circle, Path } from "react-content-loader/native"

const Skelecton = (props:any) => (
  <Facebook 
    speed={1.5}
    width={props?.width}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#d2d2db"
    foregroundColor="white"
    {...props}
    animate
  />
)

export default Skelecton

