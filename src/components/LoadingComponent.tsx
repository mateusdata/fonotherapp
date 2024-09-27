import React from "react";
import {  StatusBar, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";


const LoadingComponent= () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
    
      <ActivityIndicator animating={true} color={"#36B3B9"} size={30} />
    </View>
  );
};

export default LoadingComponent;