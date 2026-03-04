import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

const defaultImage = require("@/assets/images/login-background.jpg");

const styles = StyleSheet.create({
  root: {
    height: "100%",
    width: "100%",
    backgroundColor: "black",
  },
  image: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageStyle: {
    flex: 1,
    backgroundColor: "rgba(156, 148, 148, 0.5)",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(25,25,25,0.4)",
  },
});

type AppBackgroundProps = {
  children: React.ReactNode;
  source?: ImageSourcePropType;
  contentStyle?: ViewStyle;
};

export function AppBackground({
  children,
  source = defaultImage,
  contentStyle,
}: AppBackgroundProps) {
  return (
    <View style={styles.root}>
      <ImageBackground
        source={source}
        resizeMode="cover"
        style={[styles.image, contentStyle]}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.blur} />
        {children}
      </ImageBackground>
    </View>
  );
}
