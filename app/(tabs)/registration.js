import { Text, View, Image, TouchableOpacity, useWindowDimensions, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import clsuLogoGreen from "../../assets/images/clsuLogoGreen.png";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Alert } from "react-native";
import axios from 'axios';

const API_URL = 'http://192.168.107.151:8000/api';

const Registration = () => {
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

  const [semesters, setSemesters] = useState([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`${API_URL}/semesters`);
      
      let semestersArray = [];
      
      if (Array.isArray(response.data)) {
        semestersArray = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        semestersArray = response.data.data;
      }
      
      const formattedSemesters = semestersArray
        .map(sem => ({
          label: `${sem.semester_name} ${sem.semester_year}`,
          value: sem.semester_id,
          status: sem.semester_status
        }))
        .sort((a, b) => b.value - a.value);
      
      setSemesters(formattedSemesters);
      
      const activeSemester = formattedSemesters.find(s => s.status === 'active');
      if (activeSemester) {
        setValue(activeSemester.value);
      } else if (formattedSemesters.length > 0) {
        setValue(formattedSemesters[0].value);
      }
      
    } catch (error) {
      console.error("Error fetching semesters:", error);
    }
  };

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
            Registration Form
          </Text>
          <Text className="mt-1 text-center font-montserrat text-sm text-gray-600">
            Complete your registration
          </Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="flex-1 px-5"
          style={{ marginTop: isLandscape ? 12 : 16 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Dropdown Card */}
          <View className="mb-4 rounded-xl bg-white p-4 shadow-md shadow-gray-300">
            <Text className="font-montserrat-medium text-xs text-gray-500 uppercase mb-2">
              Select Semester
            </Text>
            <Dropdown
              style={{
                height: 50,
                borderColor: isFocus ? "#008000" : "#d1d5db",
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
              }}
              placeholderStyle={{ fontSize: 14, color: '#9ca3af', fontFamily: 'Montserrat-Regular' }}
              selectedTextStyle={{ fontSize: 14, color: '#333', fontFamily: 'Montserrat-Regular' }}
              iconStyle={{ width: 20, height: 20 }}
              data={semesters}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "-Select Semester-" : "..."}
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValue(item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={{ marginRight: 10 }}
                  color={isFocus ? "#008000" : "#9ca3af"}
                  name="book"
                  size={20}
                />
              )}
            />
          </View>

          {/* Download Button */}
          <TouchableOpacity
            className="h-12 items-center justify-center rounded-xl bg-[#008000]"
            onPress={() => Alert.alert("Download", "Download feature coming soon")}
          >
            <View className="flex-row items-center">
              <Ionicons name="download-outline" size={18} color="#fff" />
              <Text className="font-montserrat-bold text-white ml-2">Download</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Registration;