import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, Alert, useWindowDimensions } from "react-native";
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

const Prereg = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
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
        className="px-2.5 py-1 rounded"
        style={{ 
          backgroundColor: currentPage === 1 ? '#d1d5db' : COLORS.white, 
          borderWidth: 1, 
          borderColor: currentPage === 1 ? '#d1d5db' : '#d1d5db' 
        }}
        disabled={currentPage === 1}
        onPress={() => setCurrentPage(currentPage - 1)}
      >
        <Text className="font-montserrat" style={{ fontSize: fontSize - 1, color: '#374151' }}>Previous</Text>
      </TouchableOpacity>
    );

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          className="px-2.5 py-1 rounded"
          style={{ 
            backgroundColor: currentPage === i ? COLORS.green : COLORS.white, 
            borderWidth: 1, 
            borderColor: currentPage === i ? COLORS.green : '#d1d5db' 
          }}
          onPress={() => setCurrentPage(i)}
        >
          <Text className="font-montserrat" style={{ fontSize: fontSize - 1, color: currentPage === i ? COLORS.white : '#374151' }}>{i}</Text>
        </TouchableOpacity>
      );
    }

    if (endPage < totalPages) {
      pages.push(<Text key="dots" className="font-montserrat self-center" style={{ fontSize: fontSize - 1, color: '#374151' }}>...</Text>);
      pages.push(
        <TouchableOpacity
          key={totalPages}
          className="px-2.5 py-1 rounded"
          style={{ backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#d1d5db' }}
          onPress={() => setCurrentPage(totalPages)}
        >
          <Text className="font-montserrat" style={{ fontSize: fontSize - 1, color: '#374151' }}>{totalPages}</Text>
        </TouchableOpacity>
      );
    }

    pages.push(
      <TouchableOpacity
        key="next"
        className="px-2.5 py-1 rounded"
        style={{ 
          backgroundColor: currentPage === totalPages ? '#d1d5db' : COLORS.white, 
          borderWidth: 1, 
          borderColor: currentPage === totalPages ? '#d1d5db' : '#d1d5db' 
        }}
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage(currentPage + 1)}
      >
        <Text className="font-montserrat" style={{ fontSize: fontSize - 1, color: '#374151' }}>Next</Text>
      </TouchableOpacity>
    );

    return pages;
  };

  if (loading) {
    return (
      <LinearGradient
        colors={[COLORS.green, COLORS.darkGreen]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color={COLORS.white} />
        <Text className="font-montserrat text-white mt-4">Loading...</Text>
      </LinearGradient>
    );
  }

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
                COURSE PREREGISTRATION
              </Text>
              <Text className="font-montserrat text-center text-gray-600 mt-1" style={{ fontSize: fontSize }}>
                2ND SEMESTER 2025-2026
              </Text>
              
              <View 
                className="mt-4 p-3 rounded-lg flex-row"
                style={{ backgroundColor: '#f3f4f6' }}
              >
                <Text className="font-montserrat-bold" style={{ fontSize: fontSize, color: '#dc2626' }}>Note: </Text>
                <Text className="font-montserrat flex-1" style={{ fontSize: fontSize, color: '#374151' }}>
                  Preregistration is for slot monitoring only. Select courses from the list below.
                </Text>
              </View>
            </View>

            {/* Content Layout */}
            <View style={{ gap: isTablet ? 24 : 16 }}>

              {/* Locally Added Courses (Pending) - Only show when there are pending items */}
              {locallyAddedSubjects.length > 0 && (
                <View 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: COLORS.lightGold, borderWidth: 1, borderColor: COLORS.gold }}
                >
                  <View className="flex-row justify-between items-center mb-4">
                    <View 
                      className="p-2.5 rounded-lg flex-1 mr-2"
                      style={{ backgroundColor: COLORS.gold }}
                    >
                      <Text 
                        className="font-montserrat-bold text-center"
                        style={{ fontSize: fontSize, color: COLORS.green }}
                      >
                        PENDING REGISTRATION ({locallyAddedSubjects.length})
                      </Text>
                    </View>
                    <TouchableOpacity
                      disabled={registering['all']}
                      onPress={submitAllRegistrations}
                      className="px-4 py-2.5 rounded-lg"
                      style={{ backgroundColor: registering['all'] ? '#9ca3af' : COLORS.green }}
                    >
                      <Text className="font-montserrat-bold text-white" style={{ fontSize: fontSize - 1 }}>
                        {registering['all'] ? 'REGISTERING...' : 'REGISTER ALL'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="rounded-lg overflow-hidden" style={{ borderWidth: 1, borderColor: COLORS.green }}>
                    <View className="flex-row" style={{ backgroundColor: COLORS.green }}>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 0.5 }}>#</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 1.5 }}>CODE</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 2 }}>TITLE</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 1 }}>SECTION</Text>
                    </View>
                    {locallyAddedSubjects.map((subject, index) => (
                      <View key={`local-${subject.schedId}`} className="flex-row" style={{ backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.lightGreen, borderTopWidth: 1, borderColor: COLORS.green }}>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, flex: 0.5 }}>{index + 1}</Text>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, flex: 1.5 }}>{subject.subject_code}</Text>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, flex: 2 }} numberOfLines={2}>{subject.subject_title}</Text>
                        <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, flex: 1 }}>{subject.section}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

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
                    YOUR PREREGISTERED COURSES
                  </Text>
                </View>

                {/* Mobile Info Banner */}
                <View 
                  className="flex-row p-2 rounded-lg mb-4 items-center"
                  style={{ backgroundColor: COLORS.lightGreen, borderWidth: 1, borderColor: COLORS.green }}
                >
                  <Ionicons name="swap-horizontal" size={14} color={COLORS.green} />
                  <Text className="font-montserrat flex-1 ml-2" style={{ fontSize: fontSize - 1, color: COLORS.green }}>
                    Swipe left or right to see more
                  </Text>
                </View>

                {/* Table */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View className="rounded-lg overflow-hidden" style={{ minWidth: 500, borderWidth: 1, borderColor: COLORS.green }}>
                    <View className="flex-row" style={{ backgroundColor: COLORS.green }}>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 40 }}>#</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 100 }}>CODE</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 1 }}>TITLE</Text>
                      <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 80 }}>SECTION</Text>
                    </View>
                    
                    {preregisteredSubjects.length === 0 ? (
                      <View className="p-5 items-center" style={{ backgroundColor: COLORS.white }}>
                        <Ionicons name="document-outline" size={24} color={COLORS.gold} />
                        <Text className="font-montserrat text-gray-400 mt-2" style={{ fontSize: fontSize }}>
                          No courses preregistered yet
                        </Text>
                      </View>
                    ) : (
                      preregisteredSubjects.map((subject, index) => (
                        <View key={`prereg-${subject.prereg_id || index}`} className="flex-row" style={{ backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.lightGreen, borderTopWidth: 1, borderColor: COLORS.green }}>
                          <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 40 }}>{index + 1}</Text>
                          <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 100 }}>{subject.subject_code || 'N/A'}</Text>
                          <Text className="font-montserrat p-2.5 text-gray-800" style={{ fontSize: fontSize, flex: 1 }} numberOfLines={2}>{subject.subject_title || 'N/A'}</Text>
                          <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 80 }}>{subject.section}</Text>
                        </View>
                      ))
                    )}
                  </View>
                </ScrollView>
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

                {/* Loading */}
                {loadingSubjects && (
                  <View className="py-5 items-center">
                    <ActivityIndicator size="small" color={COLORS.green} />
                  </View>
                )}

                {/* Subjects Table */}
                {!loadingSubjects && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View 
                      className="rounded-lg overflow-hidden"
                      style={{ minWidth: isTablet ? 700 : 600, borderWidth: 1, borderColor: COLORS.green }}
                    >
                      <View className="flex-row" style={{ backgroundColor: COLORS.green }}>
                        <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 40 }}>#</Text>
                        <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 80 }}>STATUS</Text>
                        <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 100 }}>CODE</Text>
                        <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 80 }}>SECTION</Text>
                        <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, flex: 1 }}>TITLE</Text>
                        <Text className="font-montserrat-bold p-2.5 text-center text-white" style={{ fontSize: fontSize, width: 80 }}>ACTION</Text>
                      </View>
                      
                      {subjectsOffered.length === 0 ? (
                        <View className="p-5 items-center" style={{ backgroundColor: COLORS.white }}>
                          <Ionicons name="search-outline" size={40} color="#ccc" />
                          <Text className="font-montserrat text-gray-400 mt-2" style={{ fontSize: fontSize }}>
                            {searchQuery ? 'No subjects found' : 'No subjects available'}
                          </Text>
                        </View>
                      ) : (
                        subjectsOffered.map((subject, index) => {
                          const isAdded = locallyAddedSubjects.some(p => p.schedId === subject.schedId);
                          const isRegistered = preregisteredSubjects.some(p => p.schedId === subject.schedId);
                          const statusOpen = subject.slot_no > 0;
                          
                          return (
                            <View 
                              key={subject.schedId || index} 
                              className="flex-row"
                              style={{ backgroundColor: index % 2 === 0 ? COLORS.white : COLORS.lightGreen, borderTopWidth: 1, borderColor: COLORS.green }}
                            >
                              <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 40 }}>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </Text>
                              <View className="p-2 items-center justify-center" style={{ width: 80 }}>
                                <View 
                                  className="px-2 py-1 rounded"
                                  style={{ backgroundColor: statusOpen ? COLORS.green : '#d9534f' }}
                                >
                                  <Text className="font-montserrat-bold text-white" style={{ fontSize: fontSize - 2 }}>
                                    {statusOpen ? 'OPEN' : 'CLOSED'}
                                  </Text>
                                </View>
                              </View>
                              <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 100 }}>{subject.subject_code}</Text>
                              <Text className="font-montserrat p-2.5 text-center text-gray-800" style={{ fontSize: fontSize, width: 80 }}>{subject.section}</Text>
                              <Text className="font-montserrat p-2.5 text-gray-800" style={{ fontSize: fontSize, flex: 1 }} numberOfLines={2}>{subject.subject_title}</Text>
                              <View className="p-2 items-center justify-center" style={{ width: 80 }}>
                                <TouchableOpacity
                                  disabled={isAdded || isRegistered || !statusOpen}
                                  onPress={() => addCourse(subject)}
                                  className="px-2 py-1 rounded"
                                  style={{ backgroundColor: isRegistered ? '#5cb85c' : isAdded ? COLORS.gold : (!statusOpen ? '#9ca3af' : COLORS.green) }}
                                >
                                  <Text className="font-montserrat-bold text-white" style={{ fontSize: fontSize - 2 }}>
                                    {isRegistered ? '✓ REG' : isAdded ? 'ADDED' : 'ADD'}
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
                <View className="mt-4" style={{ gap: 10 }}>
                  <Text className="font-montserrat text-gray-600" style={{ fontSize: fontSize }}>
                    Showing {totalEntries > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
                  </Text>
                  <View className="flex-row flex-wrap" style={{ gap: 4 }}>
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