import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text, Animated, Easing, Alert } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useTextContext } from "@/context/TextContext";
import { useRecording } from "@/context/RecordingContext";

type CenterButtonState = "default" | "camera" | "listening";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const [centerState, setCenterState] = useState<CenterButtonState>("default");
  const dotAnim = useRef(new Animated.Value(0)).current;   // Animation for the three dots
  const { text, setText } = useTextContext();
  const {startRecording, stopRecording} = useRecording();

  useEffect(() => {
    if (centerState === "listening") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnim, {
            toValue: 3,
            duration: 600,
            useNativeDriver: false,
            easing: Easing.linear,
          }),
          Animated.timing(dotAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      dotAnim.stopAnimation();
      dotAnim.setValue(0);
    }
  }, [centerState]);


  const handleCenterPress = async () => {
    if (centerState === "default") {
      setCenterState("camera");
      navigation.navigate("visualizerScreen");
    } else if (centerState === "camera") {
      // start live AI listening logic here
      setCenterState("listening");
      await startRecording();
    } else if (centerState === "listening") {
      setCenterState("default");
      // stop listening logic here
      await stopRecording();
    }
  };

  const getCenterIcon = () => {
    switch (centerState) {
      case "default":
        return "sparkles-sharp";
      case "camera":
        return "mic-sharp";
      case "listening":
        return "ellipse"; 
    }
  };

  const renderListeningDots = () => {
    if (centerState !== "listening") return null;

    const dots = [0, 1, 2];
    return (
      <View className="flex-row absolute center ">
        {dots.map((i) => {
          const height = dotAnim.interpolate({
            inputRange: [0, 1, 2, 3],
            outputRange: [4, 8, 4, 4],
          });
          return (
            <Animated.View
              key={i}
              style={{
                width: 4,
                height,
                backgroundColor: "white",
                borderRadius: 2,
                marginHorizontal: 2,
              }}
            />
          );
        })}
      </View>
    );
  };

  

  return (
    <View
      style={{
        shadowColor: "#7437ff",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
      }}
      className="absolute bottom-2 w-full"
    >
      {/* Center Button */}
      <TouchableOpacity
        onPress={handleCenterPress}
        style={{
          shadowColor: "#7437ff",
          shadowOffset: { width: 2, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8,
        }}
        className="bg-[#7437ff] w-20 h-20 rounded-full z-10 items-center justify-center absolute bottom-[65%] left-[48.5%] translate-x-[-32px] shadow-lg"
      >
        {centerState === "listening" ? (
          renderListeningDots()
        ) : (
          <Ionicons name={getCenterIcon() as any} size={40} color="white" />
        )}
      </TouchableOpacity>

      {/* SVG Background */}
      <Svg height={100} viewBox="0 0 406 100">
        <Path
          d="M 20 0 H 150 C 170 0 162 20.8 198 24 C 236 22.4 230 0 250 0 H 386 Q 406 0 406 16 V 64 Q 406 80 386 80 H 20 Q 0 80 0 64 V 16 Q 0 0 20 0 Z"
          fill="white"
        />
      </Svg>

      {/* Tab buttons */}
      <View className="flex-row items-center justify-around absolute bottom-8 w-full h-[60px] px-3">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const Icon = options.tabBarIcon
            ? options.tabBarIcon({
                color: isFocused ? "#7437ff" : "gray",
                size: 24,
                focused: isFocused,
              })
            : null;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className="items-center justify-center"
            >
              {Icon}
              <Text style={{ color: isFocused ? "#7437ff" : "gray" }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
