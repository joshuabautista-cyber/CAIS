import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Ionicons } from '@expo/vector-icons';
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

const Prtf = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState("");

  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  const isSmallPhone = width < 375;

  // Responsive values
  const logoSize = isLandscape ? (isTablet ? 100 : 80) : (isTablet ? 140 : isSmallPhone ? 100 : 120);
  const logoTop = isLandscape ? 20 : (isTablet ? 50 : 67);
  const logoLeft = isLandscape ? 20 : 30;
  const cardHeight = isLandscape ? '85%' : '85%';
  const paddingHorizontal = isTablet ? 24 : (isSmallPhone ? 12 : 16);
  const headerPaddingTop = isLandscape ? 20 : (logoSize / 2 + 30);
  const titleSize = isTablet ? 22 : (isSmallPhone ? 16 : 18);
  const fontSize = isTablet ? 14 : (isSmallPhone ? 10 : 12);

  // Sample data
  const subjectsOffered = [
    { id: 1, status: "CLOSED", catalogueNumber: "AGBUS 705", section: "MAB", schedule: "irregular" },
    { id: 2, status: "CLOSED", catalogueNumber: "AGBUS 710", section: "MAB", schedule: "irregular" },
    { id: 3, status: "CLOSED", catalogueNumber: "AGBUS 715", section: "MAB", schedule: "irregular" },
    { id: 4, status: "CLOSED", catalogueNumber: "AGBUS 720", section: "MAB", schedule: "irregular" },
    { id: 5, status: "CLOSED", catalogueNumber: "AGBUS 800_1", section: "MAB", schedule: "irregular" },
  ];

  const preregisteredSubjects = [];

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

        {/* Main Content Container */}
        <View 
          className="absolute bottom-0 w-full rounded-t-[30px] bg-white"
          style={{ 
            height: cardHeight,
            paddingTop: headerPaddingTop,
            paddingHorizontal: paddingHorizontal,
            paddingBottom: insets.bottom,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="mb-4">
              <Text 
                className="font-montserrat-bold text-center"
                style={{ fontSize: titleSize, color: COLORS.green }}
              >
                PRTF
              </Text>
            </View>

            {/* Content Layout */}
            <View style={{ gap: isTablet ? 24 : 16 }}>
              
              {/* Preregistered Subjects Section */}
              <View 
                className="p-4 rounded-xl"
                style={{ backgroundColor: COLORS.lightGold, borderWidth: 1, borderColor: COLORS.gold }}
              >
                <View 
                  className="p-2.5 mb-4 rounded-lg"
                  style={{ backgroundColor: COLORS.gold }}
                >
                  <Text 
                    className="font-montserrat-bold text-center"
                    style={{ fontSize: fontSize, color: COLORS.green }}
                  >
                    PREREGISTERED SUBJECTS
                  </Text>
                </View>

                {/* Dropdown */}
                <View 
                  className="flex-row justify-between items-center p-2.5 rounded-lg border mb-2.5"
                  style={{ backgroundColor: COLORS.white, borderColor: COLORS.green }}
                >
                  <Text className="font-montserrat text-gray-600" style={{ fontSize: fontSize }}>
                    -Select Section First-
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={COLORS.green} />
                </View>

                <Text 
                  className="font-montserrat italic mb-4"
                  style={{ fontSize: fontSize - 1, color: '#d9534f' }}
                >
                  *Changing section will reset the other pre-registered subject/s
                </Text>

                {/* Table */}
                <View className="rounded-lg overflow-hidden" style={{ borderWidth: 1, borderColor: COLORS.green }}>
                  <View className="flex-row" style={{ backgroundColor: COLORS.green }}>
                    <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 0.5 }}>#</Text>
                    <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 2 }}>CATALOGUE NUMBER</Text>
                    <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 1.5 }}>SECTION</Text>
                  </View>
                  
                  {preregisteredSubjects.length === 0 ? (
                    <View className="p-5 items-center" style={{ backgroundColor: COLORS.white }}>
                      <Ionicons name="document-outline" size={24} color={COLORS.gold} />
                      <Text className="font-montserrat text-gray-400 mt-2" style={{ fontSize: fontSize }}>
                        No subjects preregistered yet
                      </Text>
                    </View>
                  ) : (
                    preregisteredSubjects.map((subject, index) => (
                      <View key={index} className="flex-row" style={{ backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.lightGreen, borderTopWidth: 1, borderColor: COLORS.green }}>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, flex: 0.5 }}>{index + 1}</Text>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, flex: 2 }}>{subject.catalogueNumber}</Text>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, flex: 1.5 }}>{subject.section}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>

              {/* Subjects Offered Section */}
              <View 
                className="p-4 rounded-xl"
                style={{ backgroundColor: COLORS.lightGreen, borderWidth: 1, borderColor: COLORS.green }}
              >
                <View 
                  className="p-2.5 mb-4 rounded-lg"
                  style={{ backgroundColor: COLORS.gold }}
                >
                  <Text 
                    className="font-montserrat-bold text-center"
                    style={{ fontSize: fontSize, color: COLORS.green }}
                  >
                    LIST OF SUBJECTS OFFERED
                  </Text>
                </View>

                {/* Search Bar */}
                <View className="mb-4">
                  <View 
                    className="flex-row items-center rounded-lg px-3"
                    style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.green }}
                  >
                    <Ionicons name="search" size={18} color={COLORS.green} />
                    <TextInput
                      className="font-montserrat flex-1 p-2.5"
                      style={{ fontSize: fontSize }}
                      placeholder="Search subjects..."
                      placeholderTextColor="#999"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                </View>

                {/* Mobile Info Banner */}
                <View 
                  className="flex-row p-2 rounded-lg mb-4 items-center"
                  style={{ backgroundColor: COLORS.lightGold, borderWidth: 1, borderColor: COLORS.gold }}
                >
                  <Ionicons name="information-circle" size={16} color={COLORS.green} />
                  <Text className="font-montserrat flex-1 ml-2" style={{ fontSize: fontSize - 1, color: COLORS.green }}>
                    Swipe left/right to view all columns
                  </Text>
                </View>

                {/* Subjects Table */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View 
                    className="rounded-lg overflow-hidden"
                    style={{ minWidth: isTablet ? 700 : 600, borderWidth: 1, borderColor: COLORS.green }}
                  >
                    <View className="flex-row" style={{ backgroundColor: COLORS.green }}>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 40 }}>#</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 80 }}>STATUS</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 180 }}>CATALOGUE NUMBER</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 100 }}>SECTION</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 120 }}>SCHEDULE</Text>
                    </View>
                    
                    {subjectsOffered.map((subject, index) => (
                      <View 
                        key={subject.id} 
                        className="flex-row"
                        style={{ backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.lightGreen, borderTopWidth: 1, borderColor: COLORS.green }}
                      >
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 40 }}>{subject.id}</Text>
                        <View className="p-2 items-center justify-center" style={{ width: 80 }}>
                          <View 
                            className="px-2 py-1 rounded"
                            style={{ backgroundColor: subject.status === 'CLOSED' ? '#d9534f' : COLORS.green }}
                          >
                            <Text className="font-montserrat-bold text-white" style={{ fontSize: fontSize - 2 }}>{subject.status}</Text>
                          </View>
                        </View>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 180 }}>{subject.catalogueNumber}</Text>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 100 }}>{subject.section}</Text>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 120 }}>{subject.schedule}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Pagination */}
                <View className="mt-4" style={{ gap: 10 }}>
                  <Text className="font-montserrat text-gray-600" style={{ fontSize: fontSize }}>
                    Showing 1 to 5 of 7,057 entries
                  </Text>
                  <View className="flex-row flex-wrap" style={{ gap: 4 }}>
                    <TouchableOpacity 
                      className="px-3 py-1.5 rounded"
                      style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.green }}
                    >
                      <Text className="font-montserrat" style={{ fontSize: fontSize, color: COLORS.green }}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="px-3 py-1.5 rounded"
                      style={{ backgroundColor: COLORS.green }}
                    >
                      <Text className="font-montserrat-bold text-white" style={{ fontSize: fontSize }}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="px-3 py-1.5 rounded"
                      style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.green }}
                    >
                      <Text className="font-montserrat" style={{ fontSize: fontSize, color: COLORS.green }}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="px-3 py-1.5 rounded"
                      style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.green }}
                    >
                      <Text className="font-montserrat" style={{ fontSize: fontSize, color: COLORS.green }}>3</Text>
                    </TouchableOpacity>
                    <Text className="font-montserrat self-center" style={{ fontSize: fontSize, color: COLORS.green }}>...</Text>
                    <TouchableOpacity 
                      className="px-3 py-1.5 rounded"
                      style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.green }}
                    >
                      <Text className="font-montserrat" style={{ fontSize: fontSize, color: COLORS.green }}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Prtf;