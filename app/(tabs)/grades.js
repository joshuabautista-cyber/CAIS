import { Text, View, Image, ActivityIndicator, Alert, ScrollView, useWindowDimensions, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import clsuLogoGreen from "../../assets/images/clsuLogoGreen.png"; 
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.107.151:8000/api'; 

const Grades = () => {
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

  // STATE MANAGEMENT
  const [semesters, setSemesters] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [semesterId, setSemesterId] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // GET USER ID FROM STORAGE ON MOUNT
  useEffect(() => {
    getUserId();
  }, []);

  // FETCH SEMESTERS ONCE USER ID IS LOADED
  useEffect(() => {
    if (userId) {
      fetchSemesters();
    }
  }, [userId]);

  // FETCH GRADES WHEN SEMESTER CHANGES
  useEffect(() => {
    if (semesterId && userId) {
      fetchGrades(semesterId);
    } else {
      setGradesData([]);
    }
  }, [semesterId, userId]);

  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        setUserId(storedUserId);
        console.log('Logged in user ID:', storedUserId);
      } else {
        setUserId('1033');
        console.log('No stored user ID, using default: 1033');
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
      setUserId('1033');
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await axios.get(`${API_URL}/semesters`);
      console.log('Semesters API Response:', response.data);
      
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
        setSemesterId(activeSemester.value);
      } else if (formattedSemesters.length > 0) {
        setSemesterId(formattedSemesters[0].value);
      }
      
    } catch (error) {
      console.error("Error fetching semesters:", error);
      Alert.alert("Error", "Could not load semesters. Please check your connection.");
    }
  };

  const fetchGrades = async (selectedSemId) => {
    if (!userId) {
      console.log('No user ID available');
      return;
    }

    setLoading(true);
    console.log(`Fetching grades for user_id: ${userId}, semester_id: ${selectedSemId}`);
    
    try {
      const response = await axios.get(`${API_URL}/grades`, {
        params: {
          user_id: userId,
          semester_id: selectedSemId
        }
      });
      
      console.log('Grades API Response:', JSON.stringify(response.data, null, 2));
      
      const gradesArray = response.data.data || [];
      
      if (gradesArray.length === 0) {
        console.log('No grades found for this combination');
      }
      
      setGradesData(gradesArray);
      
    } catch (error) {
      console.error("Error fetching grades:", error.response?.data || error.message);
      Alert.alert(
        "Error", 
        error.response?.data?.message || "Could not load grades. Please check your connection."
      );
      setGradesData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    let totalUnits = 0;
    let totalGradePoints = 0;
    let coursesWithGrades = 0;
    
    gradesData.forEach(item => {
      const units = parseFloat(item.units) || 0;
      const grade = parseFloat(item.grades) || 0;
      
      if (grade > 0 && units > 0) {
        totalUnits += units;
        totalGradePoints += (grade * units);
        coursesWithGrades++;
      }
    });

    return { totalUnits, coursesWithGrades };
  };

  const summary = calculateSummary();

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
            Academic Grades
          </Text>
          <Text className="mt-1 text-center font-montserrat text-sm text-gray-600">
            View your academic grades
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
              placeholder={!isFocus ? "- Select Semester -" : "..."}
              value={semesterId}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setSemesterId(item.value);
                setIsFocus(false);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={{ marginRight: 10 }}
                  color={isFocus ? "#008000" : "#9ca3af"}
                  name="calendar"
                  size={20}
                />
              )}
            />
          </View>

          {/* Loading State */}
          {loading && (
            <View className="py-10 items-center">
              <ActivityIndicator size="large" color="#008000" />
              <Text className="text-center text-gray-500 mt-3 font-montserrat">Loading grades...</Text>
            </View>
          )}

          {/* Summary Card */}
          {!loading && semesterId && gradesData.length > 0 && (
            <LinearGradient
              colors={['#008000', '#3bbe55']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-5 rounded-xl mb-4 shadow-lg"
            >
              <Text className="font-montserrat-bold text-white text-sm uppercase mb-3">
                Semester Summary
              </Text>
              <View className="flex-row justify-around">
                <View className="items-center">
                  <Text className="font-montserrat text-white/80 text-xs">Total Units</Text>
                  <Text className="font-montserrat-bold text-white text-3xl">{summary.totalUnits}</Text>
                </View>
                <View className="h-full w-[1px] bg-white/30" />
                <View className="items-center">
                  <Text className="font-montserrat text-white/80 text-xs">Courses</Text>
                  <Text className="font-montserrat-bold text-white text-3xl">{gradesData.length}</Text>
                </View>
              </View>
            </LinearGradient>
          )}

          {/* Swipe hint */}
          {!loading && semesterId && gradesData.length > 0 && (
            <View className="mb-3 flex-row items-center gap-2 rounded-md bg-[#e8f5e9] p-2">
              <Ionicons name="swap-horizontal" size={14} color="#008000" />
              <Text className="font-montserrat flex-1 text-[10px] text-[#008000]">Swipe left or right to see more</Text>
            </View>
          )}

          {/* Grades Table */}
          {!loading && semesterId && gradesData.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View className="rounded-xl overflow-hidden shadow-md shadow-gray-300 min-w-[500px] mb-6">
                {/* Table Header */}
                <View className="bg-[#3bbe55] flex-row">
                  <Text className="font-montserrat-bold text-white text-xs flex-[2] p-3 text-center">COURSE</Text>
                  <Text className="font-montserrat-bold text-white text-xs flex-1 p-3 text-center">UNITS</Text>
                  <Text className="font-montserrat-bold text-white text-xs flex-1 p-3 text-center">GRADE</Text>
                  <Text className="font-montserrat-bold text-white text-xs flex-1 p-3 text-center">REMARKS</Text>
                </View>

                {/* Table Body */}
                {gradesData.map((item, index) => (
                  <View 
                    key={index} 
                    className={`flex-row border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <View className="flex-[2] p-3">
                      <Text className="font-montserrat-medium text-gray-800 text-sm">
                        {item.subject_code || item.course_code || 'N/A'}
                      </Text>
                      <Text className="font-montserrat text-gray-500 text-xs" numberOfLines={1}>
                        {item.course_name || item.subject_title || 'No course name'}
                      </Text>
                    </View>
                    <Text className="font-montserrat flex-1 text-center text-gray-700 text-sm p-3">
                      {item.units || '-'}
                    </Text>
                    <Text className={`font-montserrat-bold flex-1 text-center text-sm p-3 ${
                      item.grades ? 
                        (parseFloat(item.grades) >= 3.0 ? 'text-red-600' : 'text-[#008000]') 
                        : 'text-gray-400'
                    }`}>
                      {item.grades || 'N/A'}
                    </Text>
                    <Text className={`font-montserrat-medium flex-1 text-center text-xs p-3 ${
                      item.remarks === 'PASSED' || item.remarks === 'Passed' ? 'text-green-600' : 
                      item.remarks === 'FAILED' || item.remarks === 'Failed' ? 'text-red-600' : 
                      'text-gray-400'
                    }`}>
                      {item.remarks || 'Pending'}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Empty State - No Grades */}
          {!loading && semesterId && gradesData.length === 0 && (
            <View className="bg-white rounded-xl shadow-md shadow-gray-300 p-10 items-center justify-center">
              <Ionicons name="document-outline" size={60} color="#d1d5db" />
              <Text className="font-montserrat-medium text-gray-600 text-center mt-4 text-base">
                No grades available yet
              </Text>
              <Text className="font-montserrat text-gray-400 text-center mt-2 text-sm px-6">
                You haven't enrolled in any courses for this semester, or grades haven't been submitted yet.
              </Text>
            </View>
          )}

          {/* Initial State - No Semester Selected */}
          {!loading && !semesterId && (
            <View className="bg-white rounded-xl shadow-md shadow-gray-300 p-10 items-center justify-center">
              <Ionicons name="calendar-outline" size={60} color="#008000" />
              <Text className="font-montserrat-medium text-gray-600 text-center mt-4 text-base">
                Select a semester to view grades
              </Text>
              <Text className="font-montserrat text-gray-400 text-center mt-2 text-sm">
                Choose a semester from the dropdown above
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Grades;