import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, Alert, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.107.151:8000/api';

const Prereg = () => {
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
  const titleSize = isTablet ? 'text-2xl' : 'text-lg';

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectsOffered, setSubjectsOffered] = useState([]);
  const [preregisteredSubjects, setPreregisteredSubjects] = useState([]);
  const [locallyAddedSubjects, setLocallyAddedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [userId, setUserId] = useState(null);
  const [registering, setRegistering] = useState({});
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
      setUserId(storedUserId || '1033');
    } catch (error) {
      setUserId('1033');
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await fetchPreregisteredSubjects();
      await fetchAllSubjectsOffered();
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSubjectsOffered = async () => {
    try {
      setLoadingSubjects(true);
      const response = await axios.get(`${API_URL}/prereg/all-subjects`, {
        params: { search: searchQuery, page: currentPage, per_page: itemsPerPage }
      });

      if (response.data.success) {
        setSubjectsOffered(response.data.data || []);
        if (response.data.meta) {
          setTotalPages(response.data.meta.last_page);
          setTotalEntries(response.data.meta.total);
        }
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjectsOffered([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchPreregisteredSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/prereg/user-courses`, {
        params: { user_id: userId }
      });
      if (response.data.success) {
        setPreregisteredSubjects(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching preregistered:', error);
      setPreregisteredSubjects([]);
    }
  };

  const addCourse = (subject) => {
    const isAlreadyAdded = locallyAddedSubjects.some(p => p.schedId === subject.schedId);
    const isAlreadyRegistered = preregisteredSubjects.some(p => p.schedId === subject.schedId);
    
    if (isAlreadyAdded || isAlreadyRegistered) {
      Alert.alert('Already Added', 'This course is already in your list.');
      return;
    }
    
    setLocallyAddedSubjects([...locallyAddedSubjects, subject]);
    Alert.alert('Added', 'Course added to your preregistration list.');
  };

  const submitAllRegistrations = async () => {
    if (locallyAddedSubjects.length === 0) {
      Alert.alert('No Courses', 'Please add courses before registering.');
      return;
    }

    try {
      setRegistering(prev => ({ ...prev, 'all': true }));
      
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
          
          const response = await axios.post(`${API_URL}/prereg/add`, preregData);
          results.push({ success: response.data.success, subject: subject.subject_code });
        } catch (error) {
          results.push({ success: false, subject: subject.subject_code, error: error.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      if (successCount === results.length) {
        Alert.alert('Success', `All ${successCount} courses preregistered!`);
        setLocallyAddedSubjects([]);
        await fetchPreregisteredSubjects();
      } else {
        Alert.alert('Partial Success', `${successCount}/${results.length} courses registered.`);
        await fetchPreregisteredSubjects();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to register courses');
    } finally {
      setRegistering(prev => ({ ...prev, 'all': false }));
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    
    pages.push(
      <TouchableOpacity
        key="prev"
        className={`rounded border px-2.5 py-1 ${currentPage === 1 ? 'bg-gray-300 border-gray-300' : 'bg-white border-gray-300'}`}
        disabled={currentPage === 1}
        onPress={() => setCurrentPage(currentPage - 1)}
      >
        <Text className="font-montserrat text-[11px] text-gray-800">Previous</Text>
      </TouchableOpacity>
    );

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          className={`rounded border px-2.5 py-1 ${currentPage === i ? 'bg-[#008000] border-[#008000]' : 'bg-white border-gray-300'}`}
          onPress={() => setCurrentPage(i)}
        >
          <Text className={`font-montserrat text-[11px] ${currentPage === i ? 'text-white' : 'text-gray-800'}`}>{i}</Text>
        </TouchableOpacity>
      );
    }

    if (endPage < totalPages) {
      pages.push(<Text key="dots" className="font-montserrat self-center text-[11px] text-gray-800">...</Text>);
      pages.push(
        <TouchableOpacity
          key={totalPages}
          className="rounded border border-gray-300 bg-white px-2.5 py-1"
          onPress={() => setCurrentPage(totalPages)}
        >
          <Text className="font-montserrat text-[11px] text-gray-800">{totalPages}</Text>
        </TouchableOpacity>
      );
    }

    pages.push(
      <TouchableOpacity
        key="next"
        className={`rounded border px-2.5 py-1 ${currentPage === totalPages ? 'bg-gray-300 border-gray-300' : 'bg-white border-gray-300'}`}
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage(currentPage + 1)}
      >
        <Text className="font-montserrat text-[11px] text-gray-800">Next</Text>
      </TouchableOpacity>
    );

    return pages;
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#008000', '#006400', '#004d00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="font-montserrat text-white mt-4">Loading...</Text>
      </LinearGradient>
    );
  }

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
        <View className="items-center justify-center px-5" style={{ marginTop: headerMarginTop }}>
          <Text className={`font-montserrat-bold ${titleSize} text-center text-[#008000]`}>
            COURSE PREREGISTRATION
          </Text>
          <Text className="mt-1 text-center font-montserrat text-sm text-gray-600">
            2ND SEMESTER 2025-2026
          </Text>
          
          <View className="mt-4 w-full flex-row rounded-md bg-gray-100 p-3">
            <Text className="font-montserrat-bold text-xs text-red-600">Note: </Text>
            <Text className="font-montserrat flex-1 text-xs text-gray-800">
              Preregistration is for slot monitoring only. Select courses from the list below.
            </Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          className="flex-1 px-5"
          style={{ marginTop: isLandscape ? 12 : 20 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Locally Added Courses (Pending) */}
          {locallyAddedSubjects.length > 0 && (
            <View className="mb-5 rounded-xl overflow-hidden shadow-md shadow-gray-400 bg-yellow-50 p-4 border-2 border-yellow-300">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="font-montserrat-bold text-xs text-gray-800">PENDING REGISTRATION ({locallyAddedSubjects.length})</Text>
                <TouchableOpacity
                  disabled={registering['all']}
                  onPress={submitAllRegistrations}
                  className={`px-4 py-2 rounded-lg ${registering['all'] ? 'bg-gray-400' : 'bg-[#008000]'}`}
                >
                  <Text className="font-montserrat-bold text-[11px] text-white">
                    {registering['all'] ? 'REGISTERING...' : 'REGISTER ALL'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View className="border border-yellow-400 rounded-md min-w-[500px] overflow-hidden">
                  <View className="flex-row bg-yellow-200 border-b border-yellow-400">
                    <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black w-[40px]">#</Text>
                    <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black w-[100px]">CODE</Text>
                    <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black flex-1">TITLE</Text>
                    <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black w-[80px]">SECTION</Text>
                  </View>
                  {locallyAddedSubjects.map((subject, index) => (
                    <View key={`local-${subject.schedId}`} className="flex-row border-b border-yellow-300 bg-white">
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[40px]">{index + 1}</Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[100px]">{subject.subject_code}</Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-gray-800 flex-1" numberOfLines={2}>{subject.subject_title}</Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[80px]">{subject.section}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Preregistered Subjects */}
          <View className="mb-5 rounded-xl overflow-hidden shadow-md shadow-gray-400 bg-[#f0f7f0] p-4">
            <View className="mb-4 rounded-md bg-[#3bbe55] p-2.5">
              <Text className="font-montserrat-bold text-xs text-white">YOUR PREREGISTERED COURSES</Text>
            </View>

            <View className="mb-3 flex-row items-center gap-2 rounded-md bg-[#e8f5e9] p-2">
              <Ionicons name="swap-horizontal" size={14} color="#008000" />
              <Text className="font-montserrat flex-1 text-[10px] text-[#008000]">Swipe left or right to see more</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View className="overflow-hidden rounded-md border border-gray-300 min-w-[500px]">
                <View className="flex-row bg-[#3bbe55]">
                  <Text className="font-montserrat-bold w-[40px] p-2.5 text-center text-[11px] text-white">#</Text>
                  <Text className="font-montserrat-bold w-[100px] p-2.5 text-center text-[11px] text-white">CODE</Text>
                  <Text className="font-montserrat-bold flex-1 p-2.5 text-center text-[11px] text-white">TITLE</Text>
                  <Text className="font-montserrat-bold w-[80px] p-2.5 text-center text-[11px] text-white">SECTION</Text>
                </View>
                
                {preregisteredSubjects.length === 0 ? (
                  <View className="items-center bg-white p-5">
                    <Ionicons name="document-outline" size={40} color="#ccc" />
                    <Text className="font-montserrat text-xs text-gray-400 mt-2">No courses preregistered yet</Text>
                  </View>
                ) : (
                  preregisteredSubjects.map((subject, index) => (
                    <View key={`prereg-${subject.prereg_id}-${index}`} className={`flex-row border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <Text className="font-montserrat w-[40px] p-2.5 text-center text-[11px] text-gray-800">{index + 1}</Text>
                      <Text className="font-montserrat w-[100px] p-2.5 text-center text-[11px] text-gray-800">{subject.subject_code || 'N/A'}</Text>
                      <Text className="font-montserrat flex-1 p-2.5 text-[11px] text-gray-800" numberOfLines={2}>{subject.subject_title || 'N/A'}</Text>
                      <Text className="font-montserrat w-[80px] p-2.5 text-center text-[11px] text-gray-800">{subject.section}</Text>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </View>

          {/* List of Subjects Offered */}
          <View className="rounded-xl overflow-hidden shadow-md shadow-gray-400 bg-[#fffbeb] p-4">
            <View className="mb-4 rounded-md bg-[#FFD700] p-2.5">
              <Text className="font-montserrat-bold text-xs text-[#333]">LIST OF SUBJECTS OFFERED</Text>
            </View>

            {/* Search Bar */}
            <View className="mb-4 flex-row items-center rounded-xl border-2 border-gray-200 bg-white px-4">
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                className="ml-3 flex-1 py-3 font-montserrat text-sm text-black"
                placeholder="Search by code or title..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Mobile Info Banner */}
            <View className="mb-4 flex-row items-center gap-2 rounded-md bg-[#e8f5e9] p-2">
              <Ionicons name="swap-horizontal" size={14} color="#008000" />
              <Text className="font-montserrat flex-1 text-[10px] text-[#008000]">Swipe left or right to view all columns</Text>
            </View>

            {/* Loading */}
            {loadingSubjects && (
              <View className="py-5 items-center">
                <ActivityIndicator size="small" color="#008000" />
              </View>
            )}

            {/* Subjects Table */}
            {!loadingSubjects && (
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View className="min-w-[700px] rounded-md border border-gray-300 overflow-hidden">
                  <View className="flex-row bg-[#3bbe55]">
                    <Text className="font-montserrat-bold w-[40px] p-2.5 text-center text-[11px] text-white">#</Text>
                    <Text className="font-montserrat-bold w-[70px] p-2.5 text-center text-[11px] text-white">STATUS</Text>
                    <Text className="font-montserrat-bold w-[100px] p-2.5 text-center text-[11px] text-white">CODE</Text>
                    <Text className="font-montserrat-bold w-[80px] p-2.5 text-center text-[11px] text-white">SECTION</Text>
                    <Text className="font-montserrat-bold flex-1 p-2.5 text-center text-[11px] text-white">TITLE</Text>
                    <Text className="font-montserrat-bold w-[70px] p-2.5 text-center text-[11px] text-white">ACTION</Text>
                  </View>
                  
                  {subjectsOffered.length === 0 ? (
                    <View className="p-5 items-center bg-white">
                      <Ionicons name="search-outline" size={40} color="#ccc" />
                      <Text className="font-montserrat text-gray-400 text-xs mt-2">
                        {searchQuery ? 'No courses found' : 'No courses available'}
                      </Text>
                    </View>
                  ) : (
                    subjectsOffered.map((subject, index) => {
                      const isAdded = locallyAddedSubjects.some(p => p.schedId === subject.schedId);
                      const isRegistered = preregisteredSubjects.some(p => p.schedId === subject.schedId);
                      
                      return (
                        <View key={subject.schedId || index} className={`flex-row border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <Text className="font-montserrat w-[40px] p-2.5 text-center text-[11px] text-gray-800">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </Text>
                          <View className="w-[70px] justify-center items-center p-1">
                            <View className={`px-2 py-0.5 rounded ${subject.slot_no > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                              <Text className={`font-montserrat-bold text-[9px] ${subject.slot_no > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                {subject.slot_no > 0 ? 'OPEN' : 'CLOSED'}
                              </Text>
                            </View>
                          </View>
                          <Text className="font-montserrat w-[100px] p-2.5 text-center text-[11px] text-gray-800">{subject.subject_code}</Text>
                          <Text className="font-montserrat w-[80px] p-2.5 text-center text-[11px] text-gray-800">{subject.section}</Text>
                          <Text className="font-montserrat flex-1 p-2.5 text-[11px] text-gray-800" numberOfLines={2}>{subject.subject_title}</Text>
                          <View className="w-[70px] justify-center items-center p-1">
                            <TouchableOpacity
                              disabled={isAdded || isRegistered}
                              onPress={() => addCourse(subject)}
                              className={`px-2 py-1 rounded ${isRegistered ? 'bg-green-300' : isAdded ? 'bg-yellow-300' : 'bg-[#008000]'}`}
                            >
                              <Text className={`font-montserrat-bold text-[8px] ${isRegistered || isAdded ? 'text-gray-600' : 'text-white'}`}>
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
              <Text className="font-montserrat text-[11px] text-gray-600">
                Showing {totalEntries > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
              </Text>
              <View className="flex-row flex-wrap gap-1">
                {renderPagination()}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Prereg;