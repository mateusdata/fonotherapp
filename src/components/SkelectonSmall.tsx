import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";

const SkelectonSmall = (props: any) => (
  <ContentLoader
    backgroundColor="#d2d2db"
    foregroundColor="white"
    speed={1}
    width={100}
    height={15}
    viewBox="0 0 100 15"
    style={{ width: '100%', top:10 }}
  >
    <Rect x="0" y="0" rx="5" ry="5" width="100" height="15" />
  </ContentLoader>
);

export default SkelectonSmall;
