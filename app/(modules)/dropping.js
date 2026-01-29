import React from "react";
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// University Colors
const COLORS = {
  green: '#008000',
  gold: '#FFD700',
  white: '#FFFFFF',
  lightGold: '#FFF8DC',
  darkGreen: '#006400',
};

const Dropping = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  const isSmallPhone = width < 375;
  
  // Responsive values
  const logoSize = isLandscape ? (isTablet ? 100 : 80) : (isTablet ? 140 : isSmallPhone ? 100 : 120);
  const logoTop = isLandscape ? 20 : (isTablet ? 50 : 67);
  const logoLeft = isLandscape ? 20 : 30;
  const cardHeight = isLandscape ? '85%' : '85%';
  const paddingHorizontal = isTablet ? 40 : (isSmallPhone ? 16 : 24);
  const titleSize = isTablet ? 28 : (isSmallPhone ? 20 : 24);
  const subtitleSize = isTablet ? 18 : (isSmallPhone ? 14 : 16);
  const buttonPaddingV = isTablet ? 18 : (isSmallPhone ? 12 : 16);
  const buttonPaddingH = isTablet ? 40 : (isSmallPhone ? 24 : 32);
  const iconSize = isTablet ? 64 : (isSmallPhone ? 40 : 48);
  const cardMaxWidth = isTablet ? 500 : (isLandscape ? 400 : '100%');

  return (
    <LinearGradient
      colors={[COLORS.green, COLORS.darkGreen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1">
        {/* Logo */}
        <View 
          className="absolute z-10 rounded-full bg-white"
          style={{
            top: logoTop,
            left: logoLeft,
            width: logoSize,
            height: logoSize,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Image 
            source={clsuLogoGreen} 
            style={{ width: logoSize, height: logoSize, borderRadius: logoSize / 2 }}
            resizeMode="cover"
          />
        </View>

        {/* Main Container */}
        <View 
          className="absolute bottom-0 w-full rounded-t-[30px] bg-white"
          style={{ 
            height: cardHeight,
            paddingTop: isLandscape ? 20 : (logoSize / 2 + 20),
            paddingHorizontal: paddingHorizontal,
            paddingBottom: insets.bottom + 20,
          }}
        >
          {/* Centered Content Card */}
          <View className="flex-1 justify-center items-center">
            <View 
              className="rounded-3xl p-6 items-center"
              style={{
                backgroundColor: COLORS.lightGold,
                borderWidth: 2,
                borderColor: COLORS.gold,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.15,
                shadowRadius: 15,
                elevation: 10,
                width: cardMaxWidth,
                maxWidth: '100%',
              }}
            >
              {/* Icon */}
              <View 
                className="mb-4 items-center justify-center rounded-full"
                style={{
                  width: iconSize + 24,
                  height: iconSize + 24,
                  backgroundColor: COLORS.green,
                }}
              >
                <Ionicons name="remove-circle-outline" size={iconSize} color={COLORS.gold} />
              </View>

              {/* Title */}
              <Text 
                className="font-montserrat-bold text-center mb-2"
                style={{ fontSize: titleSize, color: COLORS.green }}
              >
                Dropping of Subjects
              </Text>
              
              {/* Subtitle */}
              <Text 
                className="font-montserrat text-center text-gray-600 mb-6"
                style={{ 
                  fontSize: subtitleSize,
                  paddingHorizontal: isSmallPhone ? 8 : 16,
                }}
              >
                This feature is currently under development. Please check back later.
              </Text>
              
              {/* Go Back Button */}
              <TouchableOpacity 
                className="rounded-xl items-center flex-row justify-center"
                onPress={() => router.back()}
                activeOpacity={0.8}
                style={{
                  backgroundColor: COLORS.green,
                  paddingVertical: buttonPaddingV,
                  paddingHorizontal: buttonPaddingH,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 6,
                }}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                <Text 
                  className="font-montserrat-bold text-white"
                  style={{ fontSize: isTablet ? 18 : 16 }}
                >
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Dropping;