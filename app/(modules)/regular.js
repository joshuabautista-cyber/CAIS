import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.107.151:8000/api';

// University Colors
const COLORS = {
  green: '#008000',
  gold: '#FFD700',
  white: '#FFFFFF',
  lightGold: '#FFF8DC',
  darkGreen: '#006400',
  lightGreen: '#E8F5E9',
};

const Enrollment = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  const [selectedSection, setSelectedSection] = useState("BSIT_4-2");
  const [userId, setUserId] = useState(null);
  const [semesterId, setSemesterId] = useState(null);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [preregisteredSubjects, setPreregisteredSubjects] = useState([]);
  const [excludedSubjects, setExcludedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});

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
  const titleSize = isTablet ? 20 : (isSmallPhone ? 14 : 16);
  const fontSize = isTablet ? 14 : (isSmallPhone ? 10 : 12);

  // Get user ID and semester on mount
  useEffect(() => {
    getUserInfo();
  }, []);

  // Fetch data when user and semester are loaded
  useEffect(() => {
    if (userId && semesterId) {
      fetchEnrollmentData();
    }
  }, [userId, semesterId]);

  const getUserInfo = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      const storedSemesterId = await AsyncStorage.getItem('semester_id');
      
      // Always set values - use stored or fallback
      setUserId(storedUserId || '1033');
      setSemesterId(storedSemesterId || '11');
    } catch (error) {
      console.error('Error getting user info:', error);
      setUserId('1033');
      setSemesterId('11');
    }
  };

  const fetchEnrollmentData = async () => {
    try {
      setLoading(true);
      
      // Fetch preregistered subjects (pending status) from new preregistration table
      const preregResponse = await axios.get(`${API_URL}/prereg/user-courses`, {
        params: {
          user_id: userId
        }
      });

      if (preregResponse.data.success) {
        setPreregisteredSubjects(preregResponse.data.data || []);
      }

      // Fetch enrolled subjects (from enrollments table with approval_status)
      const enrolledResponse = await axios.get(`${API_URL}/enrollments`, {
        params: {
          user_id: userId,
          semester_id: semesterId
        }
      });

      if (enrolledResponse.data.success || Array.isArray(enrolledResponse.data)) {
        const enrolledData = Array.isArray(enrolledResponse.data) ? enrolledResponse.data : (enrolledResponse.data.data || []);
        // Filter to only show enrollments for this user that have a prereg_id (came from preregistration)
        setEnrolledSubjects(enrolledData.filter(e => e.user_id === parseInt(userId)));
      }

    } catch (error) {
      console.error('Error fetching enrollment data:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const enrollSubject = async (preregSubject) => {
    try {
      setEnrolling(prev => ({
        ...prev,
        [preregSubject.prereg_id]: true
      }));

      console.log('📝 Enrolling preregistered course:', preregSubject);

      // Use new enroll endpoint that moves prereg to enrollment
      const response = await axios.post(`${API_URL}/prereg/enroll`, {
        prereg_id: preregSubject.prereg_id
      });

      if (response.data.success) {
        Alert.alert('Success', 'Course enrolled successfully! Waiting for RA approval.');
        await fetchEnrollmentData();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to enroll course');
      }
    } catch (error) {
      console.error('Error enrolling course:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to enroll course';
      Alert.alert('Error', errorMsg);
    } finally {
      setEnrolling(prev => ({
        ...prev,
        [preregSubject.prereg_id]: false
      }));
    }
  };

  const cancelEnrollment = async (enrollmentId) => {
    Alert.alert(
      'Cancel Enrollment',
      'Are you sure you want to cancel this enrollment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await axios.delete(`${API_URL}/enrollments/${enrollmentId}`);
              if (response.data.success) {
                Alert.alert('Success', 'Enrollment cancelled');
                await fetchEnrollmentData();
              } else {
                Alert.alert('Error', response.data.message || 'Failed to cancel enrollment');
              }
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to cancel enrollment');
            }
          }
        }
      ]
    );
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
                className="font-montserrat-bold text-center mb-3"
                style={{ fontSize: titleSize, color: COLORS.green }}
              >
                2ND SEMESTER 2025-2026 ENROLLMENT
              </Text>
              
              <View 
                className="items-center rounded-lg p-3"
                style={{ backgroundColor: COLORS.gold }}
              >
                <Text className="font-montserrat-bold" style={{ fontSize: fontSize + 2, color: COLORS.green }}>
                  ENROLLMENT IS NOW CLOSED
                </Text>
              </View>
            </View>

            {/* Loading State */}
            {loading ? (
              <View className="items-center justify-center p-10">
                <ActivityIndicator size="large" color={COLORS.green} />
                <Text className="mt-3 text-gray-600" style={{ fontSize: fontSize }}>Loading enrollment data...</Text>
              </View>
            ) : (

            <>

            {/* Main Content Area */}
            <View 
              className="mb-4 rounded-xl p-4"
              style={{ backgroundColor: COLORS.lightGold, borderWidth: 1, borderColor: COLORS.gold }}
            >
              
              {/* Left Side Info */}
              <View className="mb-4">
                <View 
                  className="mb-4 rounded-lg border-l-4 p-2.5"
                  style={{ borderColor: COLORS.gold, backgroundColor: COLORS.white }}
                >
                  <Text className="font-montserrat-medium" style={{ fontSize: fontSize, color: COLORS.green }}>
                    Enroll from your preregistered courses below
                  </Text>
                </View>

                <View className="mb-2 flex-row items-center">
                  <Text className="font-montserrat-semibold mr-2" style={{ fontSize: fontSize, color: COLORS.green }}>User ID:</Text>
                  <Text className="font-montserrat" style={{ fontSize: fontSize, color: '#666' }}>{userId}</Text>
                </View>

                <View className="mb-3 flex-row items-center">
                  <Text className="font-montserrat-semibold mr-2" style={{ fontSize: fontSize, color: COLORS.green }}>Semester:</Text>
                  <Text className="font-montserrat" style={{ fontSize: fontSize, color: '#666' }}>{semesterId}</Text>
                </View>

                <TouchableOpacity 
                  onPress={fetchEnrollmentData}
                  className="self-start rounded-lg px-4 py-2 flex-row items-center"
                  style={{ backgroundColor: COLORS.green }}
                >
                  <Ionicons name="refresh" size={16} color={COLORS.gold} style={{ marginRight: 6 }} />
                  <Text className="font-montserrat-bold text-white" style={{ fontSize: fontSize }}>Reload</Text>
                </TouchableOpacity>
              </View>

              {/* Preregistered Subjects Section */}
              <View className="mt-4">
                <View 
                  className="mb-2.5 rounded-lg p-2.5"
                  style={{ backgroundColor: COLORS.gold }}
                >
                  <Text className="font-montserrat-bold" style={{ fontSize: fontSize + 2, color: COLORS.green }}>
                    Preregistered Courses ({preregisteredSubjects.length})
                  </Text>
                </View>

                {/* Swipe hint */}
                <View 
                  className="flex-row p-2 rounded-lg mb-2.5 items-center"
                  style={{ backgroundColor: COLORS.lightGreen, borderWidth: 1, borderColor: COLORS.green }}
                >
                  <Ionicons name="swap-horizontal" size={14} color={COLORS.green} />
                  <Text className="font-montserrat ml-2" style={{ fontSize: fontSize - 1, color: COLORS.green }}>
                    Swipe left or right to see more details
                  </Text>
                </View>

                {preregisteredSubjects.length === 0 ? (
                  <View 
                    className="items-center rounded-lg p-4"
                    style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.green }}
                  >
                    <Ionicons name="document-outline" size={32} color={COLORS.gold} />
                    <Text className="font-montserrat mt-2 text-gray-500" style={{ fontSize: fontSize }}>
                      No preregistered courses yet. Preregister courses first!
                    </Text>
                  </View>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View 
                      className="rounded-lg overflow-hidden"
                      style={{ minWidth: isTablet ? 800 : 700, borderWidth: 1, borderColor: COLORS.green }}
                    >
                      <View className="flex-row" style={{ backgroundColor: COLORS.green }}>
                        <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 90 }}>Action</Text>
                        <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 100 }}>Code</Text>
                        <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 150 }}>Course</Text>
                        <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 80 }}>Units</Text>
                        <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 100 }}>Section</Text>
                        <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 120 }}>Status</Text>
                      </View>
                      
                      {preregisteredSubjects.map((subject, index) => (
                        <View 
                          key={`prereg-${subject.prereg_id}-${index}`} 
                          className="flex-row items-center"
                          style={{ backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.lightGreen, borderTopWidth: 1, borderColor: COLORS.green }}
                        >
                          <View className="items-center justify-center p-2" style={{ width: 90 }}>
                            <TouchableOpacity
                              disabled={enrolling[subject.prereg_id]}
                              onPress={() => enrollSubject(subject)}
                              className="rounded-md px-2 py-1.5"
                              style={{ backgroundColor: enrolling[subject.prereg_id] ? '#999' : COLORS.green, minWidth: 70 }}
                            >
                              <Text className="font-montserrat-bold text-white text-center" style={{ fontSize: fontSize - 2 }}>
                                {enrolling[subject.prereg_id] ? '...' : 'ENROLL'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 100 }}>
                            {subject.subject_code || 'N/A'}
                          </Text>
                          <Text className="font-montserrat text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 150 }}>
                            {subject.subject_title || 'N/A'}
                          </Text>
                          <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 80 }}>
                            {subject.units || 'N/A'}
                          </Text>
                          <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 100 }}>
                            {subject.section || 'N/A'}
                          </Text>
                          <View className="items-center p-2" style={{ width: 120 }}>
                            <View className="rounded px-2 py-1" style={{ backgroundColor: COLORS.gold }}>
                              <Text className="font-montserrat-bold" style={{ fontSize: fontSize - 1, color: COLORS.green }}>Preregistered</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>

            </View>

            {/* Enrolled Subjects Section */}
            <View 
              className="mb-4 rounded-xl p-4"
              style={{ backgroundColor: COLORS.lightGreen, borderWidth: 1, borderColor: COLORS.green }}
            >
              <View 
                className="mb-2.5 rounded-lg p-2.5"
                style={{ backgroundColor: COLORS.gold }}
              >
                <Text className="font-montserrat-bold" style={{ fontSize: fontSize + 2, color: COLORS.green }}>
                  List of Enrolled Subjects ({enrolledSubjects.length})
                </Text>
              </View>

              {/* Swipe hint */}
              <View 
                className="flex-row p-2 rounded-lg mb-2.5 items-center"
                style={{ backgroundColor: COLORS.lightGold, borderWidth: 1, borderColor: COLORS.gold }}
              >
                <Ionicons name="swap-horizontal" size={14} color={COLORS.green} />
                <Text className="font-montserrat ml-2" style={{ fontSize: fontSize - 1, color: COLORS.green }}>
                  Swipe left or right to see more details
                </Text>
              </View>

              {enrolledSubjects.length === 0 ? (
                <View 
                  className="items-center rounded-lg p-4"
                  style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.green }}
                >
                  <Ionicons name="document-outline" size={32} color={COLORS.gold} />
                  <Text className="font-montserrat mt-2 text-gray-500" style={{ fontSize: fontSize }}>
                    No enrolled courses yet. Enroll from preregistered courses!
                  </Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View 
                    className="rounded-lg overflow-hidden"
                    style={{ minWidth: isTablet ? 900 : 800, borderWidth: 1, borderColor: COLORS.green }}
                  >
                    <View className="flex-row" style={{ backgroundColor: COLORS.green }}>
                      <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 80 }}>Action</Text>
                      <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 100 }}>Code</Text>
                      <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 150 }}>Course</Text>
                      <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 80 }}>Units</Text>
                      <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 100 }}>Section</Text>
                      <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 120 }}>Status</Text>
                      <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, width: 150 }}>Remarks</Text>
                    </View>
                    
                    {enrolledSubjects.map((subject, index) => (
                      <View 
                        key={`enrolled-${subject.enrollment_id}-${index}`} 
                        className="flex-row items-center"
                        style={{ backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.lightGreen, borderTopWidth: 1, borderColor: COLORS.green }}
                      >
                        <View className="items-center justify-center p-2" style={{ width: 80 }}>
                          {subject.approval_status === 'pending' ? (
                            <TouchableOpacity
                              onPress={() => cancelEnrollment(subject.enrollment_id)}
                              className="rounded px-3 py-1.5"
                              style={{ backgroundColor: '#d9534f' }}
                            >
                              <Text className="font-montserrat-bold text-white" style={{ fontSize: fontSize - 1 }}>Cancel</Text>
                            </TouchableOpacity>
                          ) : (
                            <Text className="font-montserrat text-gray-400" style={{ fontSize: fontSize }}>—</Text>
                          )}
                        </View>
                        <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 100 }}>
                          {subject.subject_code || 'N/A'}
                        </Text>
                        <Text className="font-montserrat text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 150 }}>
                          {subject.subject_title || 'N/A'}
                        </Text>
                        <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 80 }}>
                          {subject.units || 'N/A'}
                        </Text>
                        <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 100 }}>
                          {subject.section || 'N/A'}
                        </Text>
                        <View className="items-center p-2" style={{ width: 120 }}>
                          <View 
                            className="rounded px-2 py-1"
                            style={{ 
                              backgroundColor: subject.approval_status === 'approved' ? COLORS.green : 
                                               subject.approval_status === 'rejected' ? '#d9534f' : COLORS.gold
                            }}
                          >
                            <Text 
                              className="font-montserrat-bold"
                              style={{ 
                                fontSize: fontSize - 1, 
                                color: subject.approval_status === 'pending' ? COLORS.green : COLORS.white 
                              }}
                            >
                              {subject.approval_status === 'approved' ? '✓ APPROVED' : 
                               subject.approval_status === 'rejected' ? '✗ REJECTED' : 'PENDING'}
                            </Text>
                          </View>
                        </View>
                        <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, width: 150 }}>
                          {subject.remarks || '—'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            {/* Excluded Subjects Section */}
            <View 
              className="rounded-xl p-4 mb-4"
              style={{ backgroundColor: COLORS.lightGold, borderWidth: 1, borderColor: COLORS.gold }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="font-montserrat-bold" style={{ fontSize: fontSize + 2, color: COLORS.green }}>
                  Excluded Subject/s
                </Text>
                <TouchableOpacity 
                  className="rounded-lg px-4 py-2"
                  style={{ backgroundColor: COLORS.green }}
                >
                  <Text className="font-montserrat-bold text-white" style={{ fontSize: fontSize }}>Reload</Text>
                </TouchableOpacity>
              </View>

              {/* Excluded Subjects Table */}
              <View 
                className="rounded-lg overflow-hidden"
                style={{ borderWidth: 1, borderColor: COLORS.green }}
              >
                <View className="flex-row" style={{ backgroundColor: COLORS.green }}>
                  <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, flex: 2 }}>Catalogue</Text>
                  <Text className="font-montserrat-bold text-center text-white p-2.5" style={{ fontSize: fontSize, flex: 1 }}>Units</Text>
                </View>
                
                {excludedSubjects.length === 0 ? (
                  <View className="items-center p-5" style={{ backgroundColor: COLORS.white }}>
                    <Text className="font-montserrat text-gray-400" style={{ fontSize: fontSize }}>No excluded subjects</Text>
                  </View>
                ) : (
                  excludedSubjects.map((subject, index) => (
                    <View 
                      key={index} 
                      className="flex-row"
                      style={{ backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.lightGreen, borderTopWidth: 1, borderColor: COLORS.green }}
                    >
                      <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, flex: 2 }}>{subject.catalogue}</Text>
                      <Text className="font-montserrat text-center text-gray-800 p-2.5" style={{ fontSize: fontSize, flex: 1 }}>{subject.units}</Text>
                    </View>
                  ))
                )}
              </View>
            </View>

            </>
            )}

          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Enrollment;