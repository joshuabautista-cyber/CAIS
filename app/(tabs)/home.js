import React from "react";
import { View, Text, Image, ScrollView, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import clsuLogoGreen from "../../assets/images/clsuLogoGreen.png";

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  
  // Responsive values
  const logoSize = isLandscape ? (isTablet ? 100 : 90) : 120;
  const logoTop = isLandscape ? -50 : -60;
  const cardHeight = isLandscape ? '90%' : '85%';
  const headerMarginTop = isLandscape ? 60 : 80;
  const titleSize = isTablet ? 'text-3xl' : 'text-2xl';

  return (
    <LinearGradient
      colors={['#008000', '#006400', '#004d00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <View 
        className="absolute bottom-0 w-full rounded-t-3xl bg-white"
        style={{ height: cardHeight }}
      >
        {/* Logo */}
        <View 
          className="absolute z-10 rounded-full bg-white shadow-lg"
          style={{
            left: 30,
            top: logoTop,
            width: logoSize,
            height: logoSize,
          }}
        >
          <Image 
            source={clsuLogoGreen} 
            style={{ width: logoSize, height: logoSize, borderRadius: logoSize / 2 }}
          />
        </View>

        {/* Header */}
        <View className="items-center justify-center" style={{ marginTop: headerMarginTop }}>
          <Text className={`text-center font-montserrat-bold ${titleSize} text-[#008000]`}>
            Home
          </Text>
          <Text className="mt-1 text-center font-montserrat text-sm text-gray-600">
            Welcome to CAIS
          </Text>
        </View>

        {/* Content */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
          style={{ marginTop: isLandscape ? 12 : 16 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <Text className="font-montserrat-medium mb-4 text-base text-black">
            Evaluation Status
          </Text>

            {/* First table */}
            <View className="mb-5 rounded-xl overflow-hidden shadow-md shadow-gray-400">
              {/* Header row */}
              <View className="flex-row bg-[#3bbe55]">
                <View className="flex-[2] items-center justify-center border-r border-white/20 p-3">
                  <Text className="font-montserrat-bold text-center text-xs text-white">
                    SEMESTER
                  </Text>
                </View>
                <View className="flex-[1.5] items-center justify-center border-r border-white/20 p-3">
                  <Text className="font-montserrat-bold text-center text-xs text-white">
                    COURSE
                  </Text>
                </View>
                <View className="flex-[1.5] items-center justify-center border-r border-white/20 p-3">
                  <Text className="font-montserrat-bold text-center text-xs text-white">
                    SECTION
                  </Text>
                </View>
                <View className="flex-[1.5] items-center justify-center p-3">
                  <Text className="font-montserrat-bold text-center text-xs text-white">
                    NO. OF STAY
                  </Text>
                </View>
              </View>

              {/* Data row */}
              <View className="flex-row bg-white">
                <View className="flex-[2] items-center justify-center border-r border-gray-200 p-3">
                  <Text className="font-montserrat-medium text-center text-xs text-black">
                    2ND SEMESTER{"\n"}2025-2026
                  </Text>
                </View>
                <View className="flex-[1.5] items-center justify-center border-r border-gray-200 p-3">
                  <Text className="font-montserrat text-center text-xs text-gray-400">
                    -
                  </Text>
                </View>
                <View className="flex-[1.5] items-center justify-center border-r border-gray-200 p-3">
                  <Text className="font-montserrat text-center text-xs text-gray-400">
                    -
                  </Text>
                </View>
                <View className="flex-[1.5] items-center justify-center p-3">
                  <Text className="font-montserrat-medium text-center text-xs text-black">
                    - Years
                  </Text>
                </View>
              </View>
            </View>

            {/* Second table */}
            <View className="mb-8 rounded-xl overflow-hidden shadow-md shadow-gray-400">
              {/* Header row */}
              <View className="flex-row bg-[#3bbe55]">
                <View className="flex-[3] items-center justify-center border-r border-white/20 p-3">
                  <Text className="font-montserrat-bold text-center text-xs text-white">
                    EVALUATION CATEGORY
                  </Text>
                </View>
                <View className="flex-1 items-center justify-center p-3">
                  <Text className="font-montserrat-bold text-center text-xs text-white">
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
              ].map((label, index) => (
                <View 
                  key={label} 
                  className={`flex-row ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <View className="flex-[3] items-start justify-center border-r border-gray-200 px-4 py-3.5">
                    <Text className="font-montserrat text-xs text-black">
                      {label}
                    </Text>
                  </View>
                  <View className="flex-1 items-center justify-center p-3">
                    <View className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
    </LinearGradient>
  );
}