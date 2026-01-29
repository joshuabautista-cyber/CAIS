import React, { useState } from "react";
import { View, Text, Image, ScrollView, useWindowDimensions, TouchableOpacity, Modal, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import clsuLogoGreen from "../../assets/images/clsuLogoGreen.png";

// Semester options
const semesterOptions = [
  "2ND SEMESTER 2025-2026",
  "1ST SEMESTER 2025-2026",
  "MIDYEAR 2025",
  "2ND SEMESTER 2024-2025",
  "1ST SEMESTER 2024-2025",
  "MID-YEAR 2024",
  "2ND SEMESTER 2023-2024",
  "1ST SEMESTER 2023-2024",
  "MID-YEAR 2023",
  "2ND SEMESTER 2022-2023",
  "1ST SEMESTER 2022-2023",
];

// Evaluation categories data
const evaluationCategories = [
  { left: "ENTRANCE CREDENTIAL", right: "INCOMPLETE GRADES" },
  { left: "LAPSE GRADES", right: "NO GRADES" },
  { left: "FORCE DROP", right: "BEHIND SUBJECTS" },
  { left: "OTHER CONCERN", right: "INSTRUCTION FROM RIC" },
];

// Info Card Component
const InfoCard = ({ label, value, iconName, iconColor, onPress, showDropdown, isLandscape, isTablet }) => {
  // Responsive sizing
  const cardPadding = isLandscape ? (isTablet ? 'p-5' : 'p-3') : 'p-4';
  const iconSize = isLandscape ? (isTablet ? 24 : 20) : 22;
  const labelSize = isTablet ? 'text-sm' : 'text-xs';
  const valueSize = isTablet ? 'text-base' : (isLandscape ? 'text-xs' : 'text-sm');
  const dropdownValueSize = isTablet ? 'text-sm' : 'text-xs';

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      className={`bg-white rounded-2xl ${cardPadding} mx-1.5 mb-3 shadow-sm`}
      style={{
        flex: 1,
        minWidth: isLandscape ? '22%' : '45%',
        maxWidth: isLandscape ? '24%' : '48%',
        borderLeftWidth: 4,
        borderLeftColor: '#3bbe55',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Icon positioned absolutely in top-right */}
      <View style={{ position: 'absolute', top: 12, right: 12 }}>
        <Ionicons name={iconName} size={iconSize} color={iconColor || '#3bbe55'} />
      </View>
      
      {/* Content */}
      <View className="pr-8">
        <Text className={`font-montserrat ${labelSize} text-gray-500 mb-1`}>{label}</Text>
        {showDropdown ? (
          <View 
            className="flex-row items-center bg-gray-100 rounded-lg px-2 py-1.5 mt-1"
            style={{ alignSelf: 'flex-start', maxWidth: '100%' }}
          >
            <Text 
              className={`font-montserrat-bold ${dropdownValueSize} text-[#1a4d1a]`} 
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              {value}
            </Text>
            <Ionicons name="chevron-down" size={isTablet ? 16 : 14} color="#1a4d1a" style={{ marginLeft: 6 }} />
          </View>
        ) : (
          <Text className={`font-montserrat-bold ${valueSize} text-[#1a4d1a]`} numberOfLines={1}>
            {value}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [selectedSemester, setSelectedSemester] = useState("2ND SEMESTER 2025-2026");
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  
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
          className="flex-1 px-4"
          style={{ marginTop: isLandscape ? 12 : 16 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Info Cards Grid */}
          <View 
            className="flex-row flex-wrap mb-4"
            style={{ 
              justifyContent: isLandscape ? 'flex-start' : 'space-between',
              marginHorizontal: isLandscape ? -4 : 0 
            }}
          >
            <InfoCard 
              label="Semester"
              value={selectedSemester}
              iconName="calendar"
              iconColor="#e74c3c"
              onPress={() => setShowSemesterModal(true)}
              showDropdown={true}
              isLandscape={isLandscape}
              isTablet={isTablet}
            />
            <InfoCard 
              label="COURSE"
              value="N/A"
              iconName="school"
              iconColor="#3498db"
              isLandscape={isLandscape}
              isTablet={isTablet}
            />
            <InfoCard 
              label="SECTION"
              value="N/A"
              iconName="grid"
              iconColor="#9b59b6"
              isLandscape={isLandscape}
              isTablet={isTablet}
            />
            <InfoCard 
              label="YEAR/S OF RESIDENCY"
              value="N/A"
              iconName="bar-chart"
              iconColor="#f39c12"
              isLandscape={isLandscape}
              isTablet={isTablet}
            />
          </View>

          {/* Academic Overview Section */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-4" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Text className="font-montserrat-bold text-lg text-[#1a4d1a] mb-4">
              Academic Overview
            </Text>

            {/* Table Header */}
            <View className="flex-row mb-2 pb-2 border-b border-gray-200">
              <View className="flex-1">
                <Text className="font-montserrat-bold text-xs text-gray-600">
                  EVALUATION CATEGORY
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-montserrat-bold text-xs text-gray-600">
                  REMARKS/STATUS
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-montserrat-bold text-xs text-gray-600">
                  EVALUATION CATEGORY
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-montserrat-bold text-xs text-gray-600">
                  REMARKS/STATUS
                </Text>
              </View>
            </View>

            {/* Table Rows */}
            {evaluationCategories.map((row, index) => (
              <View key={index} className="flex-row py-3 border-b border-gray-100">
                <View className="flex-1">
                  <Text className="font-montserrat text-xs text-[#b8860b]">
                    {row.left}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-montserrat text-xs text-gray-400">
                    —
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-montserrat text-xs text-[#b8860b]">
                    {row.right}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-montserrat text-xs text-gray-400">
                    —
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Semester Selection Modal */}
      <Modal
        visible={showSemesterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSemesterModal(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowSemesterModal(false)}
        >
          <View className="bg-white rounded-2xl w-[85%] max-h-[70%] overflow-hidden">
            <View className="bg-[#3bbe55] p-4">
              <Text className="font-montserrat-bold text-white text-center text-base">
                Select Semester
              </Text>
            </View>
            <ScrollView className="max-h-80">
              {semesterOptions.map((semester, index) => (
                <TouchableOpacity
                  key={index}
                  className={`p-4 border-b border-gray-100 ${
                    selectedSemester === semester ? 'bg-[#e8f5e9]' : 'bg-white'
                  }`}
                  onPress={() => {
                    setSelectedSemester(semester);
                    setShowSemesterModal(false);
                  }}
                >
                  <Text className={`font-montserrat-medium text-sm ${
                    selectedSemester === semester ? 'text-[#008000]' : 'text-gray-700'
                  }`}>
                    {semester}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}