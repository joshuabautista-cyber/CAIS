import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  Image,
  useWindowDimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import clsuLogoGreen from '../assets/images/clsuLogoGreen.png';
import axios from 'axios';

const API_URL = 'http://192.168.107.151:8000/api';

const SubjectsSchedule = () => {
  const router = useRouter();
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

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [semesterInfo, setSemesterInfo] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSubjectsSchedule();
  }, [currentPage]);

  // Debounce search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setCurrentPage(1);
      fetchSubjectsSchedule();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const fetchSubjectsSchedule = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/subjects-schedule`, {
        params: {
          search: searchQuery,
          page: currentPage,
          per_page: itemsPerPage
        }
      });

      if (response.data.success) {
        setSubjects(response.data.data || []);
        setSemesterInfo(response.data.semester);
        
        if (response.data.meta) {
          setTotalPages(response.data.meta.last_page);
          setTotalEntries(response.data.meta.total);
        }
      }
    } catch (error) {
      console.error('Error fetching subjects schedule:', error);
      setSubjects([]);
    } finally {
      setLoading(false);
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
          <Text className={`font-montserrat text-[11px] ${currentPage === i ? 'text-white' : 'text-gray-800'}`}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <Text key="dots" className="font-montserrat self-center text-[11px] text-gray-800">...</Text>
      );
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
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="font-montserrat text-white mt-4">Loading subjects...</Text>
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
      <StatusBar barStyle="light-content" />
      
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

        {/* Back Button - positioned inside the white card */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute z-10 flex-row items-center rounded-full px-4 py-2"
          style={{ 
            right: 20, 
            top: 16,
            backgroundColor: '#FFD700',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Ionicons name="arrow-back" size={18} color="#004d00" />
          <Text className="ml-1 font-montserrat-bold text-sm text-[#004d00]">Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View className="items-center justify-center px-5" style={{ marginTop: headerMarginTop }}>
          <Text className={`font-montserrat-bold ${titleSize} text-center text-[#008000]`}>
            SUBJECTS SCHEDULE
          </Text>
          <Text className="mt-1 text-center font-montserrat text-sm text-gray-600">
            {semesterInfo ? `${semesterInfo.semester_name || '2ND SEMESTER'} ${semesterInfo.school_year || '2025-2026'}` : '2ND SEMESTER 2025-2026'}
          </Text>
        </View>

        {/* Content */}
        <ScrollView 
          className="flex-1 px-5"
          style={{ marginTop: isLandscape ? 12 : 20 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Main Content Card */}
          <View className="rounded-xl overflow-hidden shadow-md shadow-gray-400 bg-white p-4">
            {/* Search Bar */}
            <View className="mb-4 flex-row items-center rounded-xl border-2 border-gray-200 bg-white px-4">
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                className="ml-3 flex-1 py-3 font-montserrat text-sm text-black"
                placeholder="Search by code, title, or section..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Swipe hint */}
            <View className="mb-4 flex-row items-center gap-2 rounded-md bg-[#e8f5e9] p-2">
              <Ionicons name="swap-horizontal" size={14} color="#008000" />
              <Text className="font-montserrat flex-1 text-[10px] text-[#008000]">
                Swipe left or right to see more details
              </Text>
            </View>

            {/* Table */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View className="rounded-md border border-gray-300 min-w-[1200px] overflow-hidden">
                {/* Table Header */}
                <View className="flex-row bg-[#3bbe55]">
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[40px]">#</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[120px]">SUBJECT CODE</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[80px]">CAT NO</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[250px]">SUBJECT TITLE</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[60px]">UNITS</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[80px]">DAY</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[120px]">TIME</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[120px]">ROOM</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[80px]">SECTION</Text>
                  <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-white w-[180px]">FACULTY</Text>
                </View>

                {/* Table Body */}
                {subjects.length === 0 ? (
                  <View className="p-8 items-center bg-white">
                    <Ionicons name="search-outline" size={40} color="#ccc" />
                    <Text className="font-montserrat text-gray-400 text-xs mt-2">
                      {searchQuery ? 'No subjects found matching your search' : 'No subjects available'}
                    </Text>
                  </View>
                ) : (
                  subjects.map((subject, index) => (
                    <View 
                      key={subject.schedId || index} 
                      className={`flex-row border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[40px]">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[120px]">
                        {subject.subject_code || '--'}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[80px]">
                        {subject.cat_no || '--'}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-gray-800 w-[250px]" numberOfLines={2}>
                        {subject.subject_title || '--'}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[60px]">
                        {subject.units || '--'}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[80px]">
                        {subject.day || 'TBA'}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[120px]">
                        {subject.time || 'TBA'}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[120px]">
                        {subject.room || 'TBA'}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[80px]">
                        {subject.section || '--'}
                      </Text>
                      <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[180px]" numberOfLines={1}>
                        {subject.faculty && subject.faculty.trim() !== '' ? subject.faculty : '-- --'}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>

            {/* Pagination Info */}
            <View className="mt-4 gap-2.5">
              <Text className="font-montserrat text-[11px] text-gray-600 text-center">
                Showing {totalEntries > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
              </Text>
              <View className="flex-row flex-wrap justify-center gap-1">
                {renderPagination()}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default SubjectsSchedule;
