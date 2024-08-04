import React from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";


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
    
      <ActivityIndicator animating={true} color={"#36B3B9"} size={50} />
    </View>
  );
};

export default LoadingComponent;