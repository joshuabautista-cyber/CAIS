import React from "react";
import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from "../../assets/images/clsuLogoGreen.png";

export default function Home() {
  return (
    <LinearGradient
      colors={["#8ddd9eff", "#11581bff", "#12521dff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 flex-col items-center justify-center">
        {/* Logo with shadow */}
        <View className="absolute top-[67px] left-[30px] z-10 w-[120px] h-[120px] rounded-full bg-white shadow-lg shadow-black">
          <Image
            source={clsuLogoGreen}
            className="w-full h-full rounded-full"
          />
        </View>

        {/* White bottom sheet */}
        <View className="absolute bottom-0 h-[85%] w-full rounded-t-3xl bg-white p-5">
          <Text className="font-montserrat-medium mt-[15%] mb-4 text-base text-black">
            Evaluation Status
          </Text>

          {/* First table */}
          <View className="border border-black">
            {/* Header row */}
            <View className="flex-row">
              <View className="flex-[2] items-center justify-center border-b border-r border-black bg-white p-3">
                <Text className="font-montserrat-bold text-center text-xs text-black">
                  SEMESTER
                </Text>
              </View>
              <View className="flex-[1.5] items-center justify-center border-b border-r border-black bg-white p-3">
                <Text className="font-montserrat-bold text-center text-xs text-black">
                  COURSE
                </Text>
              </View>
              <View className="flex-[1.5] items-center justify-center border-b border-r border-black bg-white p-3">
                <Text className="font-montserrat-bold text-center text-xs text-black">
                  SECTION
                </Text>
              </View>
              <View className="flex-[1.5] items-center justify-center border-b border-black bg-white p-3">
                <Text className="font-montserrat-bold text-center text-xs text-black">
                  NO. OF STAY
                </Text>
              </View>
            </View>

            {/* Data row */}
            <View className="flex-row">
              <View className="flex-[2] items-center justify-center border-b border-r border-black bg-white p-3">
                <Text className="font-montserrat text-center text-xs text-black">
                  2ND SEMESTER 2025-2026
                </Text>
              </View>
              <View className="flex-[1.5] items-center justify-center border-b border-r border-black bg-white p-3">
                <Text className="font-montserrat text-center text-xs text-black" />
              </View>
              <View className="flex-[1.5] items-center justify-center border-b border-r border-black bg-white p-3">
                <Text className="font-montserrat text-center text-xs text-black" />
              </View>
              <View className="flex-[1.5] items-center justify-center bg-white p-3">
                <Text className="font-montserrat text-center text-xs text-black">Years</Text>
              </View>
            </View>
          </View>

          {/* Second table */}
          <View className="mt-5 border border-black">
            {/* Header row */}
            <View className="flex-row">
              <View className="flex-[3] items-center justify-center border-b border-r border-black bg-white p-3">
                <Text className="font-montserrat-bold text-center text-xs text-black">
                  EVALUATION CATEGORY
                </Text>
              </View>
              <View className="flex-1 items-center justify-center border-b border-black bg-white p-3">
                <Text className="font-montserrat-bold text-center text-xs text-black">
                  STATUS
                </Text>
              </View>
            </View>

            {[
              "ENTRANCE CREDENTIAL",
              "INCOMPLETE GRADES",
              "LAPSE",
              "NO GRADES",
              "FORCE DROPPED",
              "BEHIND SUBJECTS",
              "OTHER CONCERN",
              "INSTRUCTION FROM RIC",
            ].map((label) => (
              <View key={label} className="flex-row">
                <View className="flex-[3] items-start justify-center border-b border-r border-black bg-white px-4 py-3">
                  <Text className="font-montserrat text-xs text-black">{label}</Text>
                </View>
                <View className="flex-1 items-center justify-center border-b border-black bg-white p-3">
                  <Text className="font-montserrat text-center text-xs text-black" />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}