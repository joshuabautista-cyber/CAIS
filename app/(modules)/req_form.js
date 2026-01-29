import React from "react";
import { View, Text, TouchableOpacity, Image, useWindowDimensions, Linking, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// University Colors
const COLORS = {
  green: '#008000',
  gold: '#FFD700',
  white: '#FFFFFF',
  lightGold: '#FFF8DC',
  darkGreen: '#006400',
  lightGreen: '#E8F5E9',
};

// Instructions data
const INSTRUCTIONS = [
  {
    step: 1,
    title: 'Click "Request Now"',
    text: 'You will be redirected to the official DRMS (Document Request Management System) website.',
    icon: 'hand-left-outline',
  },
  {
    step: 2,
    title: 'Select Document Type',
    text: 'Choose the type of document you need (e.g., Transcript of Records, Certificate of Enrollment, etc.).',
    icon: 'documents-outline',
  },
  {
    step: 3,
    title: 'Fill Out Request Details',
    text: 'Provide the required information including purpose, number of copies, and delivery preference.',
    icon: 'create-outline',
  },
  {
    step: 4,
    title: 'Submit Your Request',
    text: 'Review your information and submit the form. You will receive a confirmation once your request is processed.',
    icon: 'checkmark-done-outline',
  },
];

const ReqForm = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  const isSmallPhone = width < 375;
  
  // Responsive values
  const logoSize = isLandscape ? (isTablet ? 100 : 70) : (isTablet ? 140 : isSmallPhone ? 90 : 110);
  const logoTop = isLandscape ? 15 : (isTablet ? 50 : 60);
  const logoLeft = isLandscape ? 20 : 30;
  const cardHeight = isLandscape ? '88%' : '87%';
  const paddingHorizontal = isTablet ? 40 : (isSmallPhone ? 12 : 20);
  const headerTitleSize = isTablet ? 26 : (isSmallPhone ? 18 : 22);
  const subtitleSize = isTablet ? 16 : (isSmallPhone ? 12 : 14);
  const sectionTitleSize = isTablet ? 18 : (isSmallPhone ? 14 : 16);
  const stepTitleSize = isTablet ? 15 : (isSmallPhone ? 13 : 14);
  const textSize = isTablet ? 14 : (isSmallPhone ? 11 : 12);
  const buttonPaddingV = isTablet ? 16 : (isSmallPhone ? 10 : 14);
  const buttonPaddingH = isTablet ? 32 : (isSmallPhone ? 20 : 28);
  const iconSize = isTablet ? 48 : (isSmallPhone ? 32 : 40);
  const stepIconSize = isTablet ? 22 : (isSmallPhone ? 16 : 18);

  const handleRequestNow = () => {
    Linking.openURL('https://oad.clsu2.edu.ph/drms/');
  };

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
            paddingTop: isLandscape ? 15 : (logoSize / 2 + 15),
            paddingHorizontal: paddingHorizontal,
            paddingBottom: insets.bottom + 10,
          }}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Header Section */}
            <View className="items-center mb-4">
              <View 
                className="items-center justify-center rounded-full mb-3"
                style={{
                  width: iconSize + 20,
                  height: iconSize + 20,
                  backgroundColor: COLORS.green,
                }}
              >
                <Ionicons name="clipboard-outline" size={iconSize} color={COLORS.gold} />
              </View>
              <Text 
                className="font-montserrat-bold text-center"
                style={{ fontSize: headerTitleSize, color: COLORS.green }}
              >
                Document Request Form
              </Text>
              <Text 
                className="font-montserrat text-center text-gray-600 mt-1"
                style={{ fontSize: subtitleSize }}
              >
                Request official documents online
              </Text>
            </View>

            {/* Instructions Section */}
            <View 
              className="rounded-2xl p-4 mb-4"
              style={{
                backgroundColor: COLORS.lightGold,
                borderWidth: 2,
                borderColor: COLORS.gold,
              }}
            >
              {/* Section Header */}
              <View 
                className="rounded-lg p-3 mb-4"
                style={{ backgroundColor: COLORS.green }}
              >
                <Text 
                  className="font-montserrat-bold text-center text-white"
                  style={{ fontSize: sectionTitleSize }}
                >
                  HOW TO REQUEST A DOCUMENT
                </Text>
              </View>

              {/* Steps */}
              {INSTRUCTIONS.map((item) => (
                <View 
                  key={item.step}
                  className="flex-row mb-3 rounded-xl p-3"
                  style={{ 
                    backgroundColor: COLORS.white,
                    borderWidth: 1,
                    borderColor: COLORS.lightGreen,
                  }}
                >
                  {/* Step Icon */}
                  <View 
                    className="items-center justify-center rounded-full mr-3"
                    style={{
                      width: stepIconSize + 14,
                      height: stepIconSize + 14,
                      backgroundColor: COLORS.green,
                      minWidth: stepIconSize + 14,
                    }}
                  >
                    <Ionicons name={item.icon} size={stepIconSize} color={COLORS.gold} />
                  </View>

                  {/* Step Content */}
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <View 
                        className="rounded px-2 py-0.5 mr-2"
                        style={{ backgroundColor: COLORS.gold }}
                      >
                        <Text 
                          className="font-montserrat-bold"
                          style={{ fontSize: textSize, color: COLORS.green }}
                        >
                          Step {item.step}
                        </Text>
                      </View>
                      <Text 
                        className="font-montserrat-semibold flex-1"
                        style={{ fontSize: stepTitleSize, color: COLORS.green }}
                      >
                        {item.title}
                      </Text>
                    </View>
                    <Text 
                      className="font-montserrat text-gray-600"
                      style={{ fontSize: textSize, lineHeight: textSize * 1.5 }}
                    >
                      {item.text}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Request Now Button */}
            <View className="items-center">
              <TouchableOpacity 
                className="rounded-xl items-center flex-row justify-center"
                onPress={handleRequestNow}
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
                <Ionicons name="open-outline" size={20} color={COLORS.gold} style={{ marginRight: 8 }} />
                <Text 
                  className="font-montserrat-bold text-white"
                  style={{ fontSize: isTablet ? 18 : 16 }}
                >
                  Request Now
                </Text>
              </TouchableOpacity>
              
              <Text 
                className="font-montserrat text-center text-gray-500 mt-3"
                style={{ fontSize: textSize, paddingHorizontal: 20 }}
              >
                You will be redirected to the DRMS website
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ReqForm;