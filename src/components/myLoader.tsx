import React from "react"
import  { Rect,Facebook, Circle, Path } from "react-content-loader/native"

const MyLoader = (props:any) => (
  <Facebook 
    speed={2}
    width={props?.width}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#d2d2db"
    foregroundColor="white"
    {...props}
  />
)

export default MyLoader

