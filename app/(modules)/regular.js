 import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.107.151:8000/api';

const enrollment = () => {
  const [selectedSection, setSelectedSection] = useState("BSIT_4-2");
  const [userId, setUserId] = useState(null);
  const [semesterId, setSemesterId] = useState(null);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [preregisteredSubjects, setPreregisteredSubjects] = useState([]);
  const [excludedSubjects, setExcludedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState({});

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
    try {
      Alert.alert(
        'Cancel Enrollment',
        'Are you sure you want to cancel this enrollment?',
        [
          { text: 'No', onPress: () => {} },
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
                console.error('Error cancelling enrollment:', error);
                Alert.alert('Error', error.response?.data?.message || 'Failed to cancel enrollment');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#8ddd9eff', '#11581bff', '#12521dff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 flex-col items-center justify-center">

        {/* Logo */}
        <View 
          className="absolute top-[67px] left-[30px] z-10 h-[120px] w-[120px] rounded-full bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Image source={clsuLogoGreen} className="h-full w-full rounded-full" />
        </View>

        {/* Main Content Container */}
        <View className="absolute bottom-0 h-[85%] w-full rounded-t-[30px] bg-white p-5 pt-20">
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View className="mb-5">
              <Text className="font-montserrat-bold mb-4 text-center text-lg text-[#2d5016]">
                2ND SEMESTER 2025-2026 ENROLLMENT
              </Text>
              
              <View className="items-center rounded-[5px] bg-[#ffa500] p-3">
                <Text className="font-montserrat-bold text-sm text-white">
                  ENROLLMENT IS NOW CLOSED
                </Text>
              </View>
            </View>

            {/* Loading State */}
            {loading ? (
              <View className="items-center justify-center p-10">
                <ActivityIndicator size="large" color="#2d5016" />
                <Text className="mt-3 text-sm text-gray-600">Loading enrollment data...</Text>
              </View>
            ) : (

            <>

            {/* Main Content Area */}
            <View className="mb-5 rounded-lg bg-[#f9f0d4] p-4">
              
              {/* Left Side Info */}
              <View className="mb-5">
                <View className="mb-4 rounded-[5px] border-l-4 border-[#ffc107] bg-[#fff3cd] p-2.5">
                  <Text className="font-montserrat-medium text-xs text-[#856404]">
                    Enroll from your preregistered courses below
                  </Text>
                </View>

                <View className="mb-2 flex-row items-center">
                  <Text className="font-montserrat-semibold mr-2 text-[13px] text-[#333]">User ID:</Text>
                  <Text className="font-montserrat text-[13px] text-[#666]">{userId}</Text>
                </View>

                <View className="mb-2 flex-row items-center">
                  <Text className="font-montserrat-semibold mr-2 text-[13px] text-[#333]">Semester:</Text>
                  <Text className="font-montserrat text-[13px] text-[#666]">{semesterId}</Text>
                </View>

                <TouchableOpacity 
                  onPress={fetchEnrollmentData}
                  className="self-start rounded-[5px] bg-[#5cb85c] px-2.5 py-2.5"
                >
                  <Text className="font-montserrat-bold text-[13px] text-white">Reload</Text>
                </TouchableOpacity>
              </View>

              {/* Preregistered Subjects Section */}
              <View className="mt-4">
                <View className="mb-2.5 rounded-[5px] bg-[#e6d4a8] p-2.5">
                  <Text className="font-montserrat-bold text-sm text-[#333]">
                    Preregistered Courses ({preregisteredSubjects.length})
                  </Text>
                </View>

                {/* Swipe hint */}
                <View className="flex-row bg-[#d9edf7] p-2 rounded-[5px] mb-2.5 items-center">
                  <Ionicons name="swap-horizontal" size={14} color="#31708f" />
                  <Text className="font-montserrat ml-2 text-[10px] text-[#31708f]">
                    Swipe left or right to see more details
                  </Text>
                </View>

                {preregisteredSubjects.length === 0 ? (
                  <View className="items-center rounded-[5px] border border-[#ddd] bg-[#f9f9f9] p-4">
                    <Ionicons name="document-outline" size={32} color="#ccc" />
                    <Text className="font-montserrat mt-2 text-sm text-[#999]">
                      No preregistered courses yet. Preregister courses first!
                    </Text>
                  </View>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View className="min-w-[900px] rounded-[5px] border border-black bg-white">
                      <View className="flex-row border-b border-black bg-[#f5dcc8]">
                        <Text className="font-montserrat-bold w-[80px] p-2.5 text-center text-[11px] text-black">Action</Text>
                        <Text className="font-montserrat-bold w-[100px] p-2.5 text-center text-[11px] text-black">Code</Text>
                        <Text className="font-montserrat-bold w-[150px] p-2.5 text-center text-[11px] text-black">Course</Text>
                        <Text className="font-montserrat-bold w-[80px] p-2.5 text-center text-[11px] text-black">Units</Text>
                        <Text className="font-montserrat-bold w-[100px] p-2.5 text-center text-[11px] text-black">Section</Text>
                        <Text className="font-montserrat-bold w-[120px] p-2.5 text-center text-[11px] text-black">Status</Text>
                      </View>
                      
                      {preregisteredSubjects.map((subject, index) => (
                        <View key={`prereg-${subject.prereg_id}-${index}`} className="flex-row items-center border-b border-[#ddd]">
                          <View className="w-[80px] items-center justify-center p-2">
                            <TouchableOpacity
                              disabled={enrolling[subject.prereg_id]}
                              onPress={() => enrollSubject(subject)}
                              className={`rounded-[3px] px-3 py-1.5 ${
                                enrolling[subject.prereg_id] 
                                  ? 'bg-gray-400'
                                  : 'bg-[#5cb85c]'
                              }`}
                            >
                              <Text className="font-montserrat-bold text-[11px] text-white">
                                {enrolling[subject.prereg_id] ? 'ENROLLING...' : 'ENROLL'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <Text className="font-montserrat w-[100px] p-2.5 text-center text-[11px] text-[#333]">
                            {subject.subject_code || 'N/A'}
                          </Text>
                          <Text className="font-montserrat w-[150px] p-2.5 text-[11px] text-[#333]">
                            {subject.subject_title || 'N/A'}
                          </Text>
                          <Text className="font-montserrat w-[80px] p-2.5 text-center text-[11px] text-[#333]">
                            {subject.units || 'N/A'}
                          </Text>
                          <Text className="font-montserrat w-[100px] p-2.5 text-center text-[11px] text-[#333]">
                            {subject.section || 'N/A'}
                          </Text>
                          <Text className="font-montserrat w-[120px] p-2.5 text-center text-[11px] text-blue-600">
                            Preregistered
                          </Text>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>

            </View>

            {/* Enrolled Subjects Section */}
            <View className="mb-5 rounded-lg bg-[#f9f0d4] p-4">
              <View className="mb-2.5 rounded-[5px] bg-[#e6d4a8] p-2.5">
                <Text className="font-montserrat-bold text-sm text-[#333]">
                  List of Enrolled Subjects ({enrolledSubjects.length})
                </Text>
              </View>

              {/* Swipe hint */}
              <View className="flex-row bg-[#d9edf7] p-2 rounded-[5px] mb-2.5 items-center">
                <Ionicons name="swap-horizontal" size={14} color="#31708f" />
                <Text className="font-montserrat ml-2 text-[10px] text-[#31708f]">
                  Swipe left or right to see more details
                </Text>
              </View>

              {enrolledSubjects.length === 0 ? (
                <View className="items-center rounded-[5px] border border-[#ddd] bg-[#f9f9f9] p-4">
                  <Ionicons name="document-outline" size={32} color="#ccc" />
                  <Text className="font-montserrat mt-2 text-sm text-[#999]">
                    No enrolled courses yet. Enroll from preregistered courses!
                  </Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View className="min-w-[1000px] rounded-[5px] border border-black bg-white">
                    <View className="flex-row border-b border-black bg-[#f5dcc8]">
                      <Text className="font-montserrat-bold w-[80px] p-2.5 text-center text-[11px] text-black">Action</Text>
                      <Text className="font-montserrat-bold w-[120px] p-2.5 text-center text-[11px] text-black">Code</Text>
                      <Text className="font-montserrat-bold w-[150px] p-2.5 text-center text-[11px] text-black">Course</Text>
                      <Text className="font-montserrat-bold w-[80px] p-2.5 text-center text-[11px] text-black">Units</Text>
                      <Text className="font-montserrat-bold w-[100px] p-2.5 text-center text-[11px] text-black">Section</Text>
                      <Text className="font-montserrat-bold w-[140px] p-2.5 text-center text-[11px] text-black">Approval Status</Text>
                      <Text className="font-montserrat-bold w-[180px] p-2.5 text-center text-[11px] text-black">Remarks</Text>
                    </View>
                    
                    {enrolledSubjects.map((subject, index) => (
                      <View key={`enrolled-${subject.enrollment_id}-${index}`} className="flex-row items-center border-b border-[#ddd]">
                        <View className="w-[80px] items-center justify-center p-2">
                          {subject.approval_status === 'pending' ? (
                            <TouchableOpacity
                              onPress={() => cancelEnrollment(subject.enrollment_id)}
                              className="rounded-[3px] bg-[#d9534f] px-3 py-1.5"
                            >
                              <Text className="font-montserrat-bold text-[11px] text-white">Cancel</Text>
                            </TouchableOpacity>
                          ) : (
                            <Text className="font-montserrat text-[10px] text-gray-400">—</Text>
                          )}
                        </View>
                        <Text className="font-montserrat w-[120px] p-2.5 text-center text-[11px] text-[#333]">
                          {subject.subject_code || 'N/A'}
                        </Text>
                        <Text className="font-montserrat w-[150px] p-2.5 text-[11px] text-[#333]">
                          {subject.subject_title || 'N/A'}
                        </Text>
                        <Text className="font-montserrat w-[80px] p-2.5 text-center text-[11px] text-[#333]">
                          {subject.units || 'N/A'}
                        </Text>
                        <Text className="font-montserrat w-[100px] p-2.5 text-center text-[11px] text-[#333]">
                          {subject.section || 'N/A'}
                        </Text>
                        <View className="w-[140px] items-center justify-center p-2">
                          <View className={`rounded-[3px] px-2 py-1 ${
                            subject.approval_status === 'approved' ? 'bg-[#5cb85c]' : 
                            subject.approval_status === 'rejected' ? 'bg-[#d9534f]' : 'bg-[#f0ad4e]'
                          }`}>
                            <Text className="font-montserrat-bold text-[10px] text-white">
                              {subject.approval_status === 'approved' ? '✓ APPROVED' : 
                               subject.approval_status === 'rejected' ? '✗ REJECTED' : 'PENDING'}
                            </Text>
                          </View>
                        </View>
                        <Text className="font-montserrat w-[180px] p-2.5 text-center text-[11px] text-[#333]">
                          {subject.remarks || '—'}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            {/* Excluded Subjects Section */}
            <View className="rounded-lg bg-[#f9f0d4] p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-montserrat-bold text-sm text-[#333]">Excluded Subject/s</Text>
                <TouchableOpacity className="rounded-[5px] bg-[#5cb85c] px-4 py-2">
                  <Text className="font-montserrat-bold text-xs text-white">Reload</Text>
                </TouchableOpacity>
              </View>

              {/* Excluded Subjects Table */}
              <View className="rounded-[5px] border border-black bg-white">
                <View className="flex-row border-b border-black bg-[#f5dcc8]">
                  <Text className="font-montserrat-bold flex-[0.5] p-2.5 text-center text-[11px] text-black">...</Text>
                  <Text className="font-montserrat-bold flex-[2] p-2.5 text-center text-[11px] text-black">Catalogue</Text>
                  <Text className="font-montserrat-bold flex-1 p-2.5 text-center text-[11px] text-black">Units</Text>
                </View>
                
                {excludedSubjects.length === 0 ? (
                  <View className="items-center p-5">
                    <Text className="font-montserrat text-xs text-[#999]">No excluded subjects</Text>
                  </View>
                ) : (
                  excludedSubjects.map((subject, index) => (
                    <View key={index} className="flex-row border-b border-[#ddd]">
                      <Text className="font-montserrat flex-[0.5] p-2.5 text-center text-[11px] text-[#333]">...</Text>
                      <Text className="font-montserrat flex-[2] p-2.5 text-center text-[11px] text-[#333]">{subject.catalogue}</Text>
                      <Text className="font-montserrat flex-1 p-2.5 text-center text-[11px] text-[#333]">{subject.units}</Text>
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

export default enrollment;