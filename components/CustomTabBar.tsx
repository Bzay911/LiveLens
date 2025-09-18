import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View 
    style={{
    shadowColor: "#7437ff",             
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,                     
  }}
    className="absolute bottom-2 w-full shadow-sm">
      <TouchableOpacity
        onPress={() => navigation.navigate("visualizerScreen")}
        style={{
          shadowColor: "#7437ff",
          shadowOffset: { width: 2, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 8, 
        }}
        className="bg-[#7437ff] w-20 h-20 rounded-full z-10 items-center justify-center absolute bottom-[65%] left-[48.5%] translate-x-[-32px] shadow-lg"
      >
        <Ionicons name="sparkles-sharp" size={40} color="white" />
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
