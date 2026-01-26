import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import axios from 'axios';

const API_URL = 'http://192.168.107.151:8000/api';

const SubjectsSchedule = () => {
  const router = useRouter();
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
          className="px-3 py-1.5 rounded bg-white border border-gray-400"
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

    return (
      <View className="flex-row flex-wrap justify-center gap-1 mt-4">
        {pages}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#85c593ff', '#90e49bff', '#12521dff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <StatusBar barStyle="light-content" />
      
      <View className="flex-1 pt-12 px-4">
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2 bg-white/20 rounded-full mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white text-xl font-bold">Subjects Schedule</Text>
            <Text className="text-white/80 text-xs">
              {semesterInfo ? `${semesterInfo.semester_name || ''} ${semesterInfo.school_year || ''}` : 'Real Time'}
            </Text>
          </View>
        </View>

        {/* Main Content Card */}
        <View className="flex-1 bg-white rounded-t-3xl p-4">
          {/* Title */}
          <Text className="text-center text-lg font-bold text-gray-800 mb-4">
            {semesterInfo ? `${semesterInfo.semester_name || '2ND SEMESTER'} ${semesterInfo.school_year || '2025-2026'}` : '2ND SEMESTER 2025-2026'} Subject List
          </Text>

          {/* Search Bar */}
          <View className="flex-row items-center mb-4">
            <Text className="text-sm text-gray-600 mr-2">Search:</Text>
            <TextInput
              className="flex-1 bg-gray-100 p-2.5 rounded-md border border-gray-300 text-sm"
              placeholder="Search by code, title, or section..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Swipe hint */}
          <View className="flex-row bg-[#d9edf7] p-2 rounded-md mb-3 items-center">
            <Ionicons name="swap-horizontal" size={14} color="#31708f" />
            <Text className="flex-1 ml-2 text-[10px] text-[#31708f]">
              Swipe left or right to see more details
            </Text>
          </View>

          {/* Loading State */}
          {loading ? (
            <View className="flex-1 items-center justify-center py-10">
              <ActivityIndicator size="large" color="#2d5016" />
              <Text className="mt-3 text-sm text-gray-600">Loading subjects...</Text>
            </View>
          ) : (
            <>
              {/* Table */}
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View className="border border-gray-300 rounded-md min-w-[1200px]">
                  {/* Table Header */}
                  <View className="flex-row bg-[#4a7c59] border-b border-gray-300">
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[40px] border-r border-gray-400">#</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[120px] border-r border-gray-400">SUBJECT CODE</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[80px] border-r border-gray-400">CAT NO</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[250px] border-r border-gray-400">SUBJECT TITLE</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[60px] border-r border-gray-400">UNITS</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[80px] border-r border-gray-400">DAY</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[120px] border-r border-gray-400">TIME</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[120px] border-r border-gray-400">ROOM</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[80px] border-r border-gray-400">SECTION</Text>
                    <Text className="font-bold p-2.5 text-[11px] text-center text-white w-[180px]">FACULTY</Text>
                  </View>

                  {/* Table Body */}
                  <ScrollView style={{ maxHeight: 400 }}>
                    {subjects.length === 0 ? (
                      <View className="p-8 items-center bg-white">
                        <Ionicons name="search-outline" size={40} color="#ccc" />
                        <Text className="text-gray-400 text-xs mt-2">
                          {searchQuery ? 'No subjects found matching your search' : 'No subjects available'}
                        </Text>
                      </View>
                    ) : (
                      subjects.map((subject, index) => (
                        <View 
                          key={subject.schedId || index} 
                          className={`flex-row border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[40px] border-r border-gray-200">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[120px] border-r border-gray-200">
                            {subject.subject_code || '--'}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[80px] border-r border-gray-200">
                            {subject.cat_no || '--'}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-gray-800 w-[250px] border-r border-gray-200" numberOfLines={2}>
                            {subject.subject_title || '--'}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[60px] border-r border-gray-200">
                            {subject.units || '--'}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[80px] border-r border-gray-200">
                            {subject.day || 'TBA'}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[120px] border-r border-gray-200">
                            {subject.time || 'TBA'}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[120px] border-r border-gray-200">
                            {subject.room || 'TBA'}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[80px] border-r border-gray-200">
                            {subject.section || '--'}
                          </Text>
                          <Text className="p-2.5 text-[11px] text-center text-gray-800 w-[180px]" numberOfLines={1}>
                            {subject.faculty && subject.faculty.trim() !== '' ? subject.faculty : '-- --'}
                          </Text>
                        </View>
                      ))
                    )}
                  </ScrollView>
                </View>
              </ScrollView>

              {/* Pagination Info */}
              <View className="mt-4">
                <Text className="text-xs text-gray-600 text-center">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalEntries)} of {totalEntries} entries
                </Text>
                {renderPagination()}
              </View>
            </>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default SubjectsSchedule;
