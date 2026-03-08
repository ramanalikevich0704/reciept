import { Styles } from "@/components/styles/LoginStyles";
import React from "react";
import {
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

const defaultImage = require("@/assets/images/login-background.jpg");
/** Фон для главного экрана (подставляется @1x/@2x/@3x по плотности экрана) */
export const recieptBackgroundImage = require("@/assets/images/reciept-background.png");

export const styles = StyleSheet.create({
  root: {
    height: "100%",
    width: "100%",
    backgroundColor: "black",
  },
  image: {
    flex: 1,
    ...Styles.contentPadding,
  },
  recieptImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%", // Обязательно для абсолютной позиции
    height: 250,
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
