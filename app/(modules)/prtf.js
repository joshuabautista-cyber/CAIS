import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Ionicons } from '@expo/vector-icons';

const prtf = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data - replace with your actual data
  const subjectsOffered = [
    { id: 1, status: "CLOSED", catalogueNumber: "AGBUS 705", section: "MAB", schedule: "irregular" },
    { id: 2, status: "CLOSED", catalogueNumber: "AGBUS 710", section: "MAB", schedule: "irregular" },
    { id: 3, status: "CLOSED", catalogueNumber: "AGBUS 715", section: "MAB", schedule: "irregular" },
    { id: 4, status: "CLOSED", catalogueNumber: "AGBUS 720", section: "MAB", schedule: "irregular" },
    { id: 5, status: "CLOSED", catalogueNumber: "AGBUS 800_1", section: "MAB", schedule: "irregular" },
    { id: 6, status: "CLOSED", catalogueNumber: "AGBUS 800_2", section: "MAB", schedule: "irregular" },
    { id: 7, status: "CLOSED", catalogueNumber: "AGBUS 800_3", section: "MAB", schedule: "irregular" },
    { id: 8, status: "CLOSED", catalogueNumber: "AGBUS 800_4", section: "MAB", schedule: "irregular" },
    { id: 9, status: "CLOSED", catalogueNumber: "AGBUS 800_5", section: "MAB", schedule: "irregular" },
    { id: 10, status: "CLOSED", catalogueNumber: "AGBUS 800_6", section: "MAB", schedule: "irregular" },
  ];

  const preregisteredSubjects = [
    // Empty for now - user will add subjects here
  ];

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
              <Text className="font-montserrat-bold text-lg text-center text-[#2d5016] mb-2">
                PRTF
              </Text>
              
            </View>

            {/* Vertical Layout - One Column */}
            <View className="flex-col gap-5 mt-3">
              
              {/* TOP - Preregistered Subjects */}
              <View className="bg-[#f9f0d4] p-4 rounded-lg">
                <View className="bg-[#e6d4a8] p-2.5 mb-4 rounded-md">
                  <Text className="font-montserrat-bold text-xs text-gray-800">PREREGISTERED SUBJECTS</Text>
                </View>

                {/* Dropdown */}
                <View className="flex-row justify-between items-center bg-white p-2.5 rounded-md border border-gray-300 mb-2.5">
                  <Text className="font-montserrat text-gray-600 text-xs">-Select Section First-</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </View>

                <Text className="font-montserrat text-[11px] text-red-600 italic mb-4">
                  *Changing section will reset the other pre-registered subject/s
                </Text>

                {/* Table for preregistered subjects */}
                <View className="border border-black rounded-md overflow-hidden">
                  <View className="flex-row bg-white border-b border-black">
                    <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black flex-[0.5]">#</Text>
                    <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black flex-[0.5]">...</Text>
                    <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black flex-[2]">CATALOGUE NUMBER</Text>
                    <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black flex-[1.5]">SECTION</Text>
                  </View>
                  
                  {preregisteredSubjects.length === 0 ? (
                    <View className="p-5 items-center">
                      <Text className="font-montserrat text-gray-400 text-xs">No subjects preregistered yet</Text>
                    </View>
                  ) : (
                    preregisteredSubjects.map((subject, index) => (
                      <View key={index} className="flex-row border-b border-gray-300">
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 flex-[0.5]">{index + 1}</Text>
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 flex-[0.5]">...</Text>
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 flex-[2]">{subject.catalogueNumber}</Text>
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 flex-[1.5]">{subject.section}</Text>
                      </View>
                    ))
                  )}
                </View>
              </View>

              {/* BOTTOM - List of Subjects Offered */}
              <View className="bg-[#f5dcc8] p-4 rounded-lg">
                <View className="bg-[#e6d4a8] p-2.5 mb-4 rounded-md">
                  <Text className="font-montserrat-bold text-xs text-gray-800">LIST OF SUBJECTS OFFERED</Text>
                </View>

                {/* Search Bar */}
                <View className="mb-4">
                  <TextInput
                    className="font-montserrat bg-white p-2 rounded-md border border-gray-300 text-xs"
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Mobile Info Banner */}
                <View className="flex-row bg-[#d9edf7] p-2 rounded-md mb-4 gap-2 items-center">
                  <Ionicons name="information-circle" size={16} color="#0066cc" />
                  <Text className="font-montserrat flex-1 text-[10px] text-[#31708f]">
                    FOR MOBILE USERS CLICK ⇄ BUTTON OR DRAG LEFT AND RIGHT TO VIEW ALL RECORDS
                  </Text>
                </View>

                {/* Subjects Table */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View className="border border-black rounded-md min-w-[600px]">
                    <View className="flex-row bg-[#f5dcc8] border-b border-black">
                      <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black w-[40px]">#</Text>
                      <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black w-[80px]">...</Text>
                      <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black w-[200px]">CATALOGUE NUMBER</Text>
                      <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black w-[120px]">SECTION</Text>
                      <Text className="font-montserrat-bold p-2.5 text-[11px] text-center text-black w-[160px]">...</Text>
                    </View>
                    
                    {subjectsOffered.map((subject) => (
                      <View key={subject.id} className="flex-row border-b border-gray-300 bg-white">
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[40px]">{subject.id}</Text>
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[80px]">{subject.status}</Text>
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[200px]">{subject.catalogueNumber}</Text>
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[120px]">{subject.section}</Text>
                        <Text className="font-montserrat p-2.5 text-[11px] text-center text-gray-800 w-[160px]">{subject.schedule}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Pagination */}
                <View className="mt-4 gap-2.5">
                  <Text className="font-montserrat text-[11px] text-gray-600">Showing 1 to 10 of 7,057 entries</Text>
                  <View className="flex-row flex-wrap gap-1">
                    <TouchableOpacity className="px-2.5 py-1 bg-white rounded border border-gray-300">
                      <Text className="font-montserrat text-[11px] text-gray-800">Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-2.5 py-1 bg-[#5bc0de] rounded border border-[#46b8da]">
                      <Text className="font-montserrat text-[11px] text-white">1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-2.5 py-1 bg-white rounded border border-gray-300">
                      <Text className="font-montserrat text-[11px] text-gray-800">2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-2.5 py-1 bg-white rounded border border-gray-300">
                      <Text className="font-montserrat text-[11px] text-gray-800">3</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-2.5 py-1 bg-white rounded border border-gray-300">
                      <Text className="font-montserrat text-[11px] text-gray-800">4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-2.5 py-1 bg-white rounded border border-gray-300">
                      <Text className="font-montserrat text-[11px] text-gray-800">5</Text>
                    </TouchableOpacity>
                    <Text className="font-montserrat text-[11px] text-gray-800 self-center">...</Text>
                    <TouchableOpacity className="px-2.5 py-1 bg-white rounded border border-gray-300">
                      <Text className="font-montserrat text-[11px] text-gray-800">706</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-2.5 py-1 bg-white rounded border border-gray-300">
                      <Text className="font-montserrat text-[11px] text-gray-800">Next</Text>
                    </TouchableOpacity>
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

export default prtf;