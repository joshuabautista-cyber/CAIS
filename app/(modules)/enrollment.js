import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Ionicons } from '@expo/vector-icons';

const enrollment = () => {
  const [selectedSection, setSelectedSection] = useState("BSIT_4-2");

  // Sample data - replace with your actual data
  const enrolledSubjects = [
    { id: 1, catalogue: "ITPRAC 4200", units: 9, section: "BSIT_4-2", approvalStatus: "approved", remarks: "" },
    { id: 2, catalogue: "ITCAP 4100_0", units: 0, section: "BSIT_4-2", approvalStatus: "approved", remarks: "" },
  ];

  const excludedSubjects = [
    // Empty for now
  ];

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

            {/* Main Content Area */}
            <View className="mb-5 rounded-lg bg-[#f9f0d4] p-4">
              
              {/* Left Side Info */}
              <View className="mb-5">
                <View className="mb-4 rounded-[5px] border-l-4 border-[#ffc107] bg-[#fff3cd] p-2.5">
                  <Text className="font-montserrat-medium text-xs text-[#856404]">
                    Enrollment Status: WARNING LESS 3 UNITS THAN THE NORMAL LOAD
                  </Text>
                </View>

                <View className="mb-2 flex-row items-center">
                  <Text className="font-montserrat-semibold mr-2 text-[13px] text-[#333]">Course:</Text>
                  <Text className="font-montserrat text-[13px] text-[#666]">BSIT</Text>
                </View>

                <View className="mb-2 flex-row items-center">
                  <Text className="font-montserrat-semibold mr-2 text-[13px] text-[#333]">Major:</Text>
                  <Text className="font-montserrat text-[13px] text-[#666]">BSIT - SysDev</Text>
                </View>

                <View className="mb-2 flex-row items-center">
                  <Text className="font-montserrat-semibold text-[13px] text-[#333]">Section:</Text>
                </View>

                {/* Section Dropdown */}
                <View className="mb-4 mt-1 flex-row items-center justify-between rounded-[5px] border border-[#ccc] bg-white p-2.5">
                  <Text className="font-montserrat text-[13px] text-[#333]">{selectedSection}</Text>
                  <Ionicons name="chevron-down" size={16} color="#333" />
                </View>

                <TouchableOpacity className="self-start rounded-[5px] bg-[#5cb85c] px-2.5 py-2.5">
                  <Text className="font-montserrat-bold text-[13px] text-white">Reload</Text>
                </TouchableOpacity>
              </View>

              {/* Right Side - List of Subjects */}
              <View className="mt-4">
                <View className="mb-2.5 rounded-[5px] bg-[#e6d4a8] p-2.5">
                  <Text className="font-montserrat-bold text-sm text-[#333]">List of Subject/s</Text>
                </View>

                {/* Subjects Table */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View className="min-w-[800px] rounded-[5px] border border-black bg-white">
                    <View className="flex-row border-b border-black bg-[#f5dcc8]">
                      <Text className="font-montserrat-bold w-[80px] p-2.5 text-center text-[11px] text-black">...</Text>
                      <Text className="font-montserrat-bold w-[150px] p-2.5 text-center text-[11px] text-black">Catalogue</Text>
                      <Text className="font-montserrat-bold w-[60px] p-2.5 text-center text-[11px] text-black">Units</Text>
                      <Text className="font-montserrat-bold w-[120px] p-2.5 text-center text-[11px] text-black">Section</Text>
                      <Text className="font-montserrat-bold w-[120px] p-2.5 text-center text-[11px] text-black">Approval Status</Text>
                      <Text className="font-montserrat-bold w-[270px] p-2.5 text-center text-[11px] text-black">Remarks</Text>
                    </View>
                    
                    {enrolledSubjects.map((subject) => (
                      <View key={subject.id} className="flex-row items-center border-b border-[#ddd]">
                        <View className="w-[80px] items-center justify-center p-2">
                          <TouchableOpacity className="rounded-[3px] bg-[#d9534f] px-3 py-1.5">
                            <Text className="font-montserrat-bold text-[11px] text-white">Cancel</Text>
                          </TouchableOpacity>
                        </View>
                        <Text className="font-montserrat w-[150px] p-2.5 text-center text-[11px] text-[#333]">{subject.catalogue}</Text>
                        <Text className="font-montserrat w-[60px] p-2.5 text-center text-[11px] text-[#333]">{subject.units}</Text>
                        <Text className="font-montserrat w-[120px] p-2.5 text-center text-[11px] text-[#333]">{subject.section}</Text>
                        <Text className="font-montserrat w-[120px] p-2.5 text-center text-[11px] text-[#333]">{subject.approvalStatus}</Text>
                        <Text className="font-montserrat w-[270px] p-2.5 text-center text-[11px] text-[#333]">{subject.remarks}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

            </View>

            {/* Excluded Subjects Section */}
            <View className="rounded-lg bg-[#f9f0d4] p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-montserrat-bold text-sm text-[#333]">Excluded Subject/s</Text>
                <TouchableOpacity className="rounded-[5px] bg-[#5cb85c] px-4 py-2">
                  <Text className="font-montserrat-bold text-xs text-white">Reload page</Text>
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

          </ScrollView>
        </View>

      </View>
    </LinearGradient>
  );
};

export default enrollment;