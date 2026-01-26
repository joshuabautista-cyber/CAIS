import { Text, View, Image, ActivityIndicator, Alert, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from "../../assets/images/clsuLogoGreen.png"; 
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REPLACE WITH YOUR ACTUAL IP ADDRESS
const API_URL = 'http://192.168.107.151:8000/api'; 

const Grades = () => {
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

  // Get logged-in user ID from AsyncStorage
  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        setUserId(storedUserId);
        console.log('Logged in user ID:', storedUserId);
      } else {
        // Change this fallback to match your database
        setUserId('1033'); // ← Changed from '1' to '1033'
        console.log('No stored user ID, using default: 1033');
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
      setUserId('1033'); // ← Changed from '1' to '1033'
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
      
      // Transform and sort by most recent
      const formattedSemesters = semestersArray
        .map(sem => ({
          label: `${sem.semester_name} ${sem.semester_year}`,
          value: sem.semester_id,
          status: sem.semester_status
        }))
        .sort((a, b) => b.value - a.value); // Sort by ID descending (most recent first)
      
      setSemesters(formattedSemesters);
      
      // Auto-select the first active or most recent semester
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

  // Calculate GPA and total units
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
    <View className="flex-1 bg-gray-50">
      {/* Header Section */}
      <LinearGradient
        colors={['#85c593ff', '#90e49bff', '#12521dff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="h-[25%] rounded-b-[30px] justify-center items-center shadow-lg"
      >
        <Image source={clsuLogoGreen} className="w-24 h-24 mt-8" resizeMode="contain" />
        <Text className="text-white text-2xl font-bold mt-2">
          Academic Grades
        </Text>
        {userId && (
          <Text className="text-white/80 text-xs mt-1">
            Student ID: {userId}
          </Text>
        )}
      </LinearGradient>

      {/* Main Content */}
      <ScrollView className="flex-1 -mt-10 px-6" showsVerticalScrollIndicator={false}>
        {/* Dropdown Card */}
        <View className="bg-white p-4 rounded-xl shadow-md mb-4">
          <Text className="text-gray-500 text-xs font-bold uppercase mb-2 ml-1">
            Select Semester
          </Text>
          <Dropdown
            style={{
              height: 50,
              borderColor: isFocus ? '#60c047ff' : 'gray',
              borderWidth: 0.5,
              borderRadius: 8,
              paddingHorizontal: 8,
            }}
            placeholderStyle={{ fontSize: 16, color: '#999' }}
            selectedTextStyle={{ fontSize: 16, color: '#333' }}
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
                color={isFocus ? "#60c047ff" : "gray"}
                name="calendar"
                size={20}
              />
            )}
          />
        </View>

        {/* Loading State */}
        {loading && (
          <View className="py-10">
            <ActivityIndicator size="large" color="#60c047ff" />
            <Text className="text-center text-gray-500 mt-3">Loading grades...</Text>
          </View>
        )}

        {/* Summary Card */}
        {!loading && semesterId && gradesData.length > 0 && (
          <LinearGradient
            colors={['#12521dff', '#60c047ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="p-5 rounded-xl mb-4 shadow-lg"
          >
            <Text className="text-white text-sm uppercase font-bold mb-3">
              Semester Summary
            </Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-white/80 text-xs">Total Units</Text>
                <Text className="text-white text-3xl font-bold">{summary.totalUnits}</Text>
              </View>
              <View className="h-full w-[1px] bg-white/30" />
              <View className="items-center">
                <Text className="text-white/80 text-xs">Courses</Text>
                <Text className="text-white text-3xl font-bold">{gradesData.length}</Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Grades Table/List */}
        {!loading && semesterId && gradesData.length > 0 && (
          <View className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            {/* Table Header */}
            <View className="bg-[#12521dff] flex-row p-3">
              <Text className="text-white text-xs font-bold flex-[2]">COURSE</Text>
              <Text className="text-white text-xs font-bold flex-1 text-center">UNITS</Text>
              <Text className="text-white text-xs font-bold flex-1 text-center">GRADE</Text>
              <Text className="text-white text-xs font-bold flex-1 text-center">REMARKS</Text>
            </View>

            {/* Table Body */}
            {gradesData.map((item, index) => (
              <View 
                key={index} 
                className={`flex-row p-3 border-b border-gray-100 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <View className="flex-[2]">
                  <Text className="text-gray-800 font-semibold text-sm">
                    {item.subject_code || item.course_code || 'N/A'}
                  </Text>
                  <Text className="text-gray-500 text-xs" numberOfLines={1}>
                    {item.course_name || item.subject_title || 'No course name'}
                  </Text>
                </View>
                <Text className="flex-1 text-center text-gray-700 text-sm">
                  {item.units || '-'}
                </Text>
                <Text className={`flex-1 text-center font-bold text-sm ${
                  item.grades ? 
                    (parseFloat(item.grades) >= 3.0 ? 'text-red-600' : 'text-[#60c047ff]') 
                    : 'text-gray-400'
                }`}>
                  {item.grades || 'N/A'}
                </Text>
                <Text className={`flex-1 text-center text-xs font-semibold ${
                  item.remarks === 'PASSED' || item.remarks === 'Passed' ? 'text-green-600' : 
                  item.remarks === 'FAILED' || item.remarks === 'Failed' ? 'text-red-600' : 
                  'text-gray-400'
                }`}>
                  {item.remarks || 'Pending'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty State - No Grades */}
        {!loading && semesterId && gradesData.length === 0 && (
          <View className="bg-white rounded-xl shadow-md p-10 items-center justify-center">
            <AntDesign name="inbox" size={60} color="#d1d5db" />
            <Text className="text-gray-600 text-center mt-4 text-base font-semibold">
              No grades available yet
            </Text>
            <Text className="text-gray-400 text-center mt-2 text-sm px-6">
              You haven't enrolled in any courses for this semester, or grades haven't been submitted yet.
            </Text>
            <Text className="text-gray-300 text-center mt-3 text-xs">
              User ID: {userId} | Semester ID: {semesterId}
            </Text>
          </View>
        )}

        {/* Initial State - No Semester Selected */}
        {!loading && !semesterId && (
          <View className="bg-white rounded-xl shadow-md p-10 items-center justify-center mb-6">
            <AntDesign name="select1" size={60} color="#60c047ff" />
            <Text className="text-gray-600 text-center mt-4 text-base font-semibold">
              Select a semester to view grades
            </Text>
            <Text className="text-gray-400 text-center mt-2 text-sm">
              Choose a semester from the dropdown above
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Grades;