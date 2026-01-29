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

// Procedure steps data
const PROCEDURE_STEPS = [
  {
    step: 1,
    text: 'Download the form for Leave of Absence',
    link: 'ACA.OAD.YYY.F.026-Application-for-leave-of-absence',
    url: 'https://clsu.edu.ph/forms/ACA.OAD.YYY.F.026-Application-for-leave-of-absence',
  },
  {
    step: 2,
    text: 'The student must sign and fill out the form including the date of application.',
  },
  {
    step: 3,
    text: 'Look for the concerned Record-In-Charge if currently enrolled or Frontline officer if inactive students for the evaluation and signature.',
  },
  {
    step: 4,
    text: 'Go to the Registration Adviser and College Dean for approval and signature.',
  },
  {
    step: 5,
    text: 'Photocopy the approved Leave of Absence for 2 copies ready for distribution (Original copy for the Office of Admission, 1 Photocopy for the Dean, and 1 Photocopy for the student).',
  },
];

const Loa = () => {
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
  const sectionTitleSize = isTablet ? 18 : (isSmallPhone ? 14 : 16);
  const textSize = isTablet ? 15 : (isSmallPhone ? 12 : 13);
  const buttonPaddingV = isTablet ? 16 : (isSmallPhone ? 10 : 14);
  const buttonPaddingH = isTablet ? 32 : (isSmallPhone ? 20 : 28);
  const iconSize = isTablet ? 48 : (isSmallPhone ? 32 : 40);
  const stepNumberSize = isTablet ? 24 : (isSmallPhone ? 18 : 20);

  const handleDownloadForm = () => {
    Linking.openURL('https://clsu.edu.ph/forms/ACA.OAD.YYY.F.026-Application-for-leave-of-absence');
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
                <Ionicons name="document-text-outline" size={iconSize} color={COLORS.gold} />
              </View>
              <Text 
                className="font-montserrat-bold text-center"
                style={{ fontSize: headerTitleSize, color: COLORS.green }}
              >
                Leave of Absence
              </Text>
            </View>

            {/* Procedure Section */}
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
                  PROCEDURE FOR PROCESSING OF LEAVE OF ABSENCE
                </Text>
              </View>

              {/* Steps */}
              {PROCEDURE_STEPS.map((item) => (
                <View 
                  key={item.step}
                  className="flex-row mb-3"
                  style={{ paddingRight: isSmallPhone ? 4 : 8 }}
                >
                  {/* Step Number */}
                  <View 
                    className="items-center justify-center rounded-full mr-3"
                    style={{
                      width: stepNumberSize + 8,
                      height: stepNumberSize + 8,
                      backgroundColor: COLORS.green,
                      minWidth: stepNumberSize + 8,
                    }}
                  >
                    <Text 
                      className="font-montserrat-bold text-white"
                      style={{ fontSize: stepNumberSize - 6 }}
                    >
                      {item.step}
                    </Text>
                  </View>

                  {/* Step Text */}
                  <View className="flex-1">
                    <Text 
                      className="font-montserrat text-gray-700"
                      style={{ fontSize: textSize, lineHeight: textSize * 1.5 }}
                    >
                      {item.text}
                      {item.link && (
                        <Text 
                          className="font-montserrat-semibold"
                          style={{ color: COLORS.green }}
                          onPress={() => item.url && Linking.openURL(item.url)}
                        >
                          {' '}{item.link}
                        </Text>
                      )}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Download Button */}
            <View className="items-center">
              <TouchableOpacity 
                className="rounded-xl items-center flex-row justify-center"
                onPress={handleDownloadForm}
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
                <Ionicons name="download-outline" size={20} color={COLORS.gold} style={{ marginRight: 8 }} />
                <Text 
                  className="font-montserrat-bold text-white"
                  style={{ fontSize: isTablet ? 18 : 16 }}
                >
                  Download Form
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Loa;