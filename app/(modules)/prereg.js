import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.107.151:8000/api'; // Replace with your actual API URL

const Prereg = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectsOffered, setSubjectsOffered] = useState([]);
  const [preregisteredSubjects, setPreregisteredSubjects] = useState([]);
  const [locallyAddedSubjects, setLocallyAddedSubjects] = useState([]); // NEW: Local staging
  const [loading, setLoading] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [userId, setUserId] = useState(null);
  const [registering, setRegistering] = useState({}); // CHANGED: Track registration status per item
  const itemsPerPage = 10;

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchInitialData();
    }
  }, [userId]);

  useEffect(() => {
    fetchAllSubjectsOffered();
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setCurrentPage(1);
      fetchAllSubjectsOffered();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('user_id');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        setUserId('1033'); // Fallback for testing
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
      setUserId('1033');
    }
  };

const fetchInitialData = async () => {
  try {
    setLoading(true);
    
    console.log('🚀 Starting to fetch initial data...');
    
    // Fetch preregistered subjects for this user
    await fetchPreregisteredSubjects();
    
    // Fetch all subjects offered (across all semesters)
    await fetchAllSubjectsOffered();

  } catch (error) {
    console.error('❌ Error fetching initial data:', error);
    console.error('❌ Error response:', error.response?.data);
  } finally {
    setLoading(false);
  }
};

const fetchAllSubjectsOffered = async () => {
  try {
    setLoadingSubjects(true);
    
    console.log('🔍 Fetching ALL subjects (no semester filter)', {
      search: searchQuery,
      page: currentPage,
      per_page: itemsPerPage
    });
    
    const response = await axios.get(`${API_URL}/prereg/all-subjects`, {
      params: {
        search: searchQuery,
        page: currentPage,
        per_page: itemsPerPage
      }
    });

    console.log('📚 Full response:', JSON.stringify(response.data, null, 2));
    console.log('📚 Success:', response.data.success);
    console.log('📚 Data length:', response.data.data?.length);

    if (response.data.success) {
      const subjects = response.data.data || [];
      console.log('✅ Setting subjects:', subjects.length, 'items');
      setSubjectsOffered(subjects);
      
      if (response.data.meta) {
        console.log('📊 Meta:', response.data.meta);
        setTotalPages(response.data.meta.last_page);
        setTotalEntries(response.data.meta.total);
      }
    } else {
      console.log('❌ Success was false');
    }
  } catch (error) {
    console.error('❌ Error fetching all subjects:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    setSubjectsOffered([]);
  } finally {
    setLoadingSubjects(false);
  }
};

const fetchPreregisteredSubjects = async () => {
  try {
    const response = await axios.get(`${API_URL}/prereg/user-courses`, {
      params: {
        user_id: userId
      }
    });

    console.log('✅ Preregistered subjects response:', JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      setPreregisteredSubjects(response.data.data || []);
      console.log('📋 Preregistered count:', response.data.data?.length);
    }
  } catch (error) {
    console.error('❌ Error fetching preregistered subjects:', error);
    setPreregisteredSubjects([]);
  }
};

const addCourse = async (subject) => {
  try {
    // Check if already added locally or registered
    const isAlreadyAdded = locallyAddedSubjects.some(
      p => p.schedId === subject.schedId
    );
    const isAlreadyRegistered = preregisteredSubjects.some(
      p => p.schedId === subject.schedId
    );
    
    if (isAlreadyAdded || isAlreadyRegistered) {
      Alert.alert('Already Added', 'You have already added this course to your preregistration list.');
      return;
    }

    console.log('➕ Adding course to local list:', subject);
    
    // Add to local staging (no API call yet)
    setLocallyAddedSubjects([...locallyAddedSubjects, subject]);
    Alert.alert('Added', 'Course added to your preregistration list.');

  } catch (error) {
    console.error('❌ Error adding course:', error);
    Alert.alert('Error', 'Failed to add course');
  }
};

// NEW: Submit ALL locally added courses to API with single button
const submitAllRegistrations = async () => {
  if (locallyAddedSubjects.length === 0) {
    Alert.alert('No Courses', 'Please add courses before registering.');
    return;
  }

  try {
    setRegistering(prev => ({
      ...prev,
      'all': true
    }));
    
    console.log('🎯 Submitting all preregistrations:', locallyAddedSubjects.length, 'courses');

    // Submit each course to NEW preregistration API
    const results = [];
    for (const subject of locallyAddedSubjects) {
      try {
        const preregData = {
          user_id: parseInt(userId),
          semester_id: parseInt(subject.semester_id),
          course_id: parseInt(subject.course_id),
          schedId: parseInt(subject.schedId),
          section: subject.section,
          subject_code: subject.subject_code,
          subject_title: subject.subject_title,
          units: parseInt(subject.units) || 0,
          status: 'pending'
        };
        
        console.log('📤 Sending preregistration data:', preregData);
        
        const response = await axios.post(`${API_URL}/prereg/add`, preregData);

        console.log('✅ Preregistration response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.success) {
          results.push({ success: true, subject: subject.subject_code });
        } else {
          results.push({ success: false, subject: subject.subject_code, error: response.data.message });
        }
      } catch (error) {
        console.error('❌ Error preregistering course:', subject.subject_code);
        console.error('Error details:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        const errorMsg = error.response?.data?.errors 
          ? JSON.stringify(error.response.data.errors)
          : error.response?.data?.message || error.message || 'Unknown error';
        
        results.push({ 
          success: false, 
          subject: subject.subject_code, 
          error: errorMsg
        });
      }
    }

    // Show summary
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    if (failureCount === 0) {
      Alert.alert('Success', `All ${successCount} courses preregistered successfully!`);
      setLocallyAddedSubjects([]);
      await fetchPreregisteredSubjects();
    } else {
      const failedDetails = results
        .filter(r => !r.success)
        .map(r => `${r.subject}: ${r.error}`)
        .join('\n\n');
      
      Alert.alert(
        'Preregistration Error',
        `${successCount} course(s) preregistered successfully.\n\nFailed Courses:\n${failedDetails}`,
        [{ text: 'OK' }]
      );
      // Remove successfully preregistered courses from local list
      const successfulIds = results.filter(r => r.success).map(r => r.subject);
      setLocallyAddedSubjects(
        locallyAddedSubjects.filter(s => !successfulIds.includes(s.subject_code))
      );
      await fetchPreregisteredSubjects();
    }
  } catch (error) {
    console.error('❌ Error in preregistration process:', error);
    Alert.alert('Error', error.message || 'Failed to preregister courses');
  } finally {
    setRegistering(prev => ({
      ...prev,
      'all': false
    }));
  }
};

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    
    pages.push(
      <TouchableOpacity
        key="prev"
        className={`px-3 py-1.5 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-white border border-gray-400'}`}
        disabled={currentPage === 1}
        onPress={() => setCurrentPage(currentPage - 1)}
      >
        <Text className="text-[11px] text-gray-800">Previous</Text>
      </TouchableOpacity>
    );

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          className={`px-3 py-1.5 rounded ${currentPage === i ? 'bg-[#5bc0de]' : 'bg-white border border-gray-400'}`}
          onPress={() => setCurrentPage(i)}
        >
          <Text className={`text-[11px] ${currentPage === i ? 'text-white font-bold' : 'text-gray-800'}`}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <Text key="dots" className="text-[11px] text-gray-800 self-center px-1">...</Text>
      );
      pages.push(
        <TouchableOpacity
          key={totalPages}
          className="px-3 py-1.5 bg-white rounded border border-gray-400"
          onPress={() => setCurrentPage(totalPages)}
        >
          <Text className="text-[11px] text-gray-800">{totalPages}</Text>
        </TouchableOpacity>
      );
    }

    pages.push(
      <TouchableOpacity
        key="next"
        className={`px-3 py-1.5 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-white border border-gray-400'}`}
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage(currentPage + 1)}
      >
        <Text className="text-[11px] text-gray-800">Next</Text>
      </TouchableOpacity>
    );

    return pages;
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#8ddd9eff', '#11581bff', '#12521dff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4 font-semibold">Loading...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#8ddd9eff', '#11581bff', '#12521dff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 flex-col justify-center items-center"> 

        {/* Logo */}
        <View 
          className="w-[120px] h-[120px] rounded-full top-[67px] left-[30px] absolute z-10 bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Image source={clsuLogoGreen} className="w-full h-full rounded-full"/>
        </View>

        {/* Main Content Container */}
        <View className="bg-white w-full h-[85%] rounded-t-[30px] absolute bottom-0 p-5 pt-20">
          <ScrollView showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View className="mb-5">
              <Text className="text-lg text-center text-[#2d5016] mb-4 font-bold">
                COURSE PREREGISTRATION
              </Text>
              
              <View className="flex-row bg-gray-100 p-3 rounded-md mb-4">
                <Text className="font-bold text-red-600 text-xs">Note: </Text>
                <Text className="flex-1 text-xs text-gray-800">
                  Please be advised that the preregistration is for slot monitoring only. 
                  Select courses from the list below to preregister.
                </Text>
              </View>

              <View className="p-3 rounded-md items-center bg-blue-500">
                <Text className="font-bold text-white text-sm">
                  VIEWING ALL AVAILABLE COURSES
                </Text>
              </View>
            </View>

            {/* Vertical Layout */}
            <View className="flex-col gap-5 mt-5">
              
              {/* TOP - Preregistered Subjects */}
              <View className="bg-[#f9f0d4] p-4 rounded-lg">
                <View className="bg-[#e6d4a8] p-2.5 mb-4 rounded-md">
                  <Text className="font-bold text-xs text-gray-800">YOUR PREREGISTERED COURSES</Text>
                </View>

                {/* Swipe hint */}
                <View className="flex-row bg-[#d9edf7] p-2 rounded-md mb-3 items-center">
                  <Ionicons name="swap-horizontal" size={14} color="#31708f" />
                  <Text className="flex-1 ml-2 text-[10px] text-[#31708f]">
                    Swipe left or right to see more details
                  </Text>
                </View>

                {/* Locally Added Courses Section */}
                {locallyAddedSubjects.length > 0 && (
                  <View className="mb-4 bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300">
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="font-bold text-xs text-gray-800">PENDING REGISTRATION ({locallyAddedSubjects.length})</Text>
                      <TouchableOpacity
                        disabled={registering['all']}
                        onPress={submitAllRegistrations}
                        className={`px-3 py-1.5 rounded ${
                          registering['all'] 
                            ? 'bg-gray-400' 
                            : 'bg-green-600'
                        }`}
                      >
                        <Text className={`text-[10px] font-bold text-white`}>
                          {registering['all'] ? 'REGISTERING...' : 'REGISTER ALL'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Locally added courses list */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                      <View className="border border-yellow-400 rounded-md min-w-[650px] overflow-hidden">
                        <View className="flex-row bg-yellow-200 border-b border-yellow-400">
                          <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[40px] border-r border-yellow-400">#</Text>
                          <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[100px] border-r border-yellow-400">CODE</Text>
                          <Text className="font-bold p-2.5 text-[11px] text-center text-black flex-1 border-r border-yellow-400">COURSE NAME</Text>
                          <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[80px]">SECTION</Text>
                        </View>
                        
                        {locallyAddedSubjects.map((subject, index) => (
                          <View key={`local-${subject.schedId}`} className={`flex-row border-b border-yellow-300 bg-white`}>
                            <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[40px] border-r border-yellow-300">{index + 1}</Text>
                            <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[100px] border-r border-yellow-300">{subject.subject_code}</Text>
                            <Text className="p-2.5 text-[11px] text-gray-800 flex-1 border-r border-yellow-300" numberOfLines={2}>{subject.subject_title}</Text>
                            <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[80px]">{subject.section}</Text>
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  </View>
                )}

                {/* Already Submitted Courses Section */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View className="border border-gray-400 rounded-md min-w-[650px] overflow-hidden">
                    <View className="flex-row bg-[#e6d4a8] border-b border-gray-400">
                      <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[40px] border-r border-gray-400">#</Text>
                      <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[100px] border-r border-gray-400">CODE</Text>
                      <Text className="font-bold p-2.5 text-[11px] text-center text-black flex-1 border-r border-gray-400">COURSE NAME</Text>
                      <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[80px]">SECTION</Text>
                    </View>
                    
                    {preregisteredSubjects.length === 0 ? (
                      <View className="p-5 items-center bg-white">
                        <Ionicons name="document-outline" size={40} color="#ccc" />
                        <Text className="text-gray-400 text-xs mt-2">No courses preregistered yet</Text>
                      </View>
                    ) : (
                      preregisteredSubjects.map((subject, index) => (
                        <View key={`prereg-${subject.prereg_id}-${index}`} className={`flex-row border-b border-gray-300 bg-green-50`}>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[40px] border-r border-gray-300">{index + 1}</Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[100px] border-r border-gray-300">{subject.subject_code || 'N/A'}</Text>
                          <Text className="p-2.5 text-[11px] text-gray-800 flex-1 border-r border-gray-300" numberOfLines={2}>{subject.subject_title || 'N/A'}</Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[80px]">{subject.section}</Text>
                        </View>
                      ))
                    )}
                  </View>
                </ScrollView>
              </View>

              {/* BOTTOM - List of Subjects Offered */}
              <View className="bg-[#f5dcc8] p-4 rounded-lg">
                <View className="bg-[#e6d4a8] p-2.5 mb-4 rounded-md">
                  <Text className="font-bold text-xs text-gray-800">LIST OF SUBJECTS OFFERED</Text>
                </View>

                {/* Search Bar */}
                <View className="mb-4">
                  <TextInput
                    className="bg-white p-2.5 rounded-md border border-gray-300 text-xs"
                    placeholder="Search by subject code or title..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Swipe hint */}
                <View className="flex-row bg-[#d9edf7] p-2 rounded-md mb-4 items-center">
                  <Ionicons name="swap-horizontal" size={14} color="#31708f" />
                  <Text className="flex-1 ml-2 text-[10px] text-[#31708f]">
                    Swipe left or right to see more details
                  </Text>
                </View>

                {/* Loading indicator for subjects */}
                {loadingSubjects && (
                  <View className="py-5">
                    <ActivityIndicator size="small" color="#12521dff" />
                  </View>
                )}

                {/* Subjects Table */}
                {!loadingSubjects && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View className="border border-gray-400 rounded-md min-w-[750px] overflow-hidden">
                      <View className="flex-row bg-[#e6d4a8] border-b border-gray-400">
                        <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[40px] border-r border-gray-400">#</Text>
                        <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[80px] border-r border-gray-400">STATUS</Text>
                        <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[100px] border-r border-gray-400">CODE</Text>
                        <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[80px] border-r border-gray-400">SECTION</Text>
                        <Text className="font-bold p-2.5 text-[11px] text-center text-black flex-1 border-r border-gray-400">TITLE</Text>
                        <Text className="font-bold p-2.5 text-[11px] text-center text-black w-[70px]">ACTION</Text>
                      </View>
                      
                      {subjectsOffered.length === 0 ? (
                        <View className="p-5 items-center bg-white">
                          <Ionicons name="search-outline" size={40} color="#ccc" />
                          <Text className="text-gray-400 text-xs mt-2">
                            {searchQuery ? 'No courses found matching your search' : 'No courses available'}
                          </Text>
                        </View>
                      ) : (
                        subjectsOffered.map((subject, index) => {
                          const isAdded = locallyAddedSubjects.some(
                            p => p.schedId === subject.schedId
                          );
                          const isRegistered = preregisteredSubjects.some(
                            p => p.course_id === subject.course_id
                          );
                          
                          return (
                            <View key={subject.schedId || index} className={`flex-row border-b border-gray-300 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[40px] border-r border-gray-300">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </Text>
                              <View className="w-[80px] border-r border-gray-300 justify-center items-center p-1">
                                <View className={`px-2 py-0.5 rounded ${subject.slot_no > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                  <Text className={`text-[10px] font-bold ${subject.slot_no > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                    {subject.slot_no > 0 ? 'OPEN' : 'CLOSED'}
                                  </Text>
                                </View>
                              </View>
                              <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[100px] border-r border-gray-300">
                                {subject.subject_code}
                              </Text>
                              <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[80px] border-r border-gray-300">
                                {subject.section}
                              </Text>
                              <Text className="p-2.5 text-[11px] text-gray-800 flex-1 border-r border-gray-300" numberOfLines={2}>
                                {subject.subject_title}
                              </Text>
                              <View className="w-[70px] border-l border-gray-300 justify-center items-center p-1">
                                <TouchableOpacity
                                  disabled={isAdded || isRegistered}
                                  onPress={() => addCourse(subject)}
                                  className={`px-1.5 py-1 rounded ${
                                    isRegistered 
                                      ? 'bg-green-300'
                                      : isAdded 
                                      ? 'bg-yellow-300'
                                      : 'bg-blue-500'
                                  }`}
                                >
                                  <Text className={`text-[8px] font-bold ${
                                    isRegistered || isAdded
                                      ? 'text-gray-600' 
                                      : 'text-white'
                                  }`}>
                                    {isRegistered ? '✓ REG' : isAdded ? 'PENDING' : 'ADD'}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })
                      )}
                    </View>
                  </ScrollView>
                )}

                {/* Pagination */}
                <View className="mt-4 gap-2.5">
                  <Text className="text-[11px] text-gray-600">
                    Showing {totalEntries > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
                  </Text>
                  <View className="flex-row flex-wrap gap-1">
                    {renderPagination()}
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

export default Prereg;