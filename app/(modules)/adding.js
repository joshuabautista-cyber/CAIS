import React from "react";
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import clsuLogoGreen from '../../assets/images/clsu.png';
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Adding = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  
  // Responsive values
  const logoSize = isLandscape ? (isTablet ? 100 : 90) : 120;
  const logoTop = isLandscape ? -50 : -60;
  const cardHeight = isLandscape ? '90%' : '85%';
  const headerMarginTop = isLandscape ? '8%' : '15%';
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

        {/* Coming Soon Card */}
        <View className="flex-1 justify-center items-center px-5">
          <View 
            className="w-full rounded-2xl bg-white p-8 items-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
              maxWidth: isTablet ? 400 : '100%',
            }}
          >
            {/* Icon */}
            <View className="mb-6">
              <LinearGradient
                colors={['#008000', '#006400']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-24 w-24 items-center justify-center rounded-full"
              >
                <Ionicons name="construct-outline" size={48} color="#fff" />
              </LinearGradient>
            </View>

            {/* Title */}
            <Text className="mb-2 text-center font-montserrat-bold text-2xl text-[#008000]">
              Coming Soon
            </Text>
            
            {/* Subtitle */}
            <Text className="mb-6 text-center font-montserrat text-base text-gray-500 px-4">
              This feature is currently under development. Please check back later.
            </Text>
            
            {/* Back Button */}
            <TouchableOpacity 
              className="items-center justify-center rounded-xl bg-[#008000] px-8 py-3"
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="arrow-back" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text className="font-montserrat-bold text-base text-white">
                  Go Back
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Adding;