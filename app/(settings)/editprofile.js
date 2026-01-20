import { View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const EditProfile = () => {
  const [name, setName] = useState('Liane Jonyl A. Tomas');
  const [email, setEmail] = useState('liane.tomas@clsu2.edu.ph');
  const [studentType, setStudentType] = useState('STUDENT');
  const [birthdate, setBirthdate] = useState('September 1, 1939');

  const handleSave = () => {
    // Add your save logic here
    console.log('Profile saved');
    router.back();
  };

  return (
    <LinearGradient
      colors={['#8ddd9eff', '#11581bff', '#12521dff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 flex-col">
        {/* Header */}
        <View className="absolute top-[50px] left-0 right-0 flex-row items-center px-5 z-10">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl text-white font-bold italic">CAIS</Text>
            <Text className="text-lg text-white italic">Edit Profile</Text>
          </View>
        </View>
      </View>

      <View className="bg-white w-full h-[85%] rounded-t-[30px] absolute bottom-0 p-5">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="pt-5 pb-10">
            <Text className="text-xl font-semibold text-black mb-5">Personal Information</Text>

            {/* Name Input */}
            <View className="mb-5">
              <Text className="text-base text-gray-800 mb-2 font-medium">Full Name</Text>
              <TextInput
                className="bg-gray-100 border border-[#65d15bff] rounded-xl p-4 text-base text-black"
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
              />
            </View>

            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-base text-gray-800 mb-2 font-medium">Email Address</Text>
              <TextInput
                className="bg-gray-100 border border-[#65d15bff] rounded-xl p-4 text-base text-black"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Student Type Input */}
            <View className="mb-5">
              <Text className="text-base text-gray-800 mb-2 font-medium">Student Type</Text>
              <TextInput
                className="bg-gray-100 border border-[#65d15bff] rounded-xl p-4 text-base text-black"
                value={studentType}
                onChangeText={setStudentType}
                placeholder="Student type"
                editable={false}
              />
            </View>

            {/* Birthdate Input */}
            <View className="mb-5">
              <Text className="text-base text-gray-800 mb-2 font-medium">Date of Birth</Text>
              <TextInput
                className="bg-gray-100 border border-[#65d15bff] rounded-xl p-4 text-base text-black"
                value={birthdate}
                onChangeText={setBirthdate}
                placeholder="Enter your birthdate"
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity 
              className="bg-[#60c047ff] py-4 rounded-xl items-center mt-2.5"
              onPress={handleSave}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text className="text-white text-lg font-bold">Save Changes</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity 
              className="bg-gray-300 py-4 rounded-xl items-center mt-4"
              onPress={() => router.back()}
            >
              <Text className="text-gray-800 text-lg font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default EditProfile;