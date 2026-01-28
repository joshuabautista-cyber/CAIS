import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, useWindowDimensions } from 'react-native';
import { Text } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EditProfile = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  
  // Responsive values
  const containerHeight = isLandscape ? '95%' : '90%';
  const contentMaxWidth = isTablet ? 600 : '100%';
  const horizontalPadding = isTablet ? 40 : 24;

  const [name, setName] = useState('Liane Jonyl A. Tomas');
  const [email, setEmail] = useState('liane.tomas@clsu2.edu.ph');
  const [birthdate, setBirthdate] = useState('September 1, 1939');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [birthdateFocused, setBirthdateFocused] = useState(false);

  const handleSave = () => {
    // Add your save logic here
    Alert.alert('Success', 'Profile updated successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <LinearGradient
      colors={["#4CAF50", "#2E7D32", "#1B5E20"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      {/* Green header spacer */}
      <View style={{ height: isLandscape ? '5%' : '10%' }} />
      
      {/* Main Content Container */}
      <View 
        className="flex-1 rounded-t-[30px] bg-white"
        style={{ 
          paddingTop: isLandscape ? 12 : 16,
          paddingHorizontal: horizontalPadding,
          paddingBottom: insets.bottom || 16
        }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="flex-row items-center mb-2"
            style={{ marginTop: isLandscape ? 8 : 16 }}
          >
            <Ionicons name="arrow-back" size={24} color="#008000" />
            <Text className="ml-2 font-montserrat-medium text-[#008000]">Back</Text>
          </TouchableOpacity>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              maxWidth: contentMaxWidth,
              alignSelf: 'center',
              width: '100%',
              paddingBottom: 40
            }}
          >
            {/* Header */}
            <View className="mb-5">
              <Text className="font-montserrat-bold text-2xl text-[#008000]">
                Edit Profile
              </Text>
              <Text className="mt-1 font-montserrat text-sm text-gray-600">
                Update your personal information
              </Text>
            </View>

            {/* Name Input */}
            <View className="mb-4">
              <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
                Full Name
              </Text>
              <View 
                className={`flex-row items-center rounded-xl border-2 bg-gray-50 px-4 ${
                  nameFocused ? 'border-[#008000]' : 'border-gray-200'
                }`}
              >
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={nameFocused ? "#008000" : "#9ca3af"} 
                />
                <TextInput
                  className="ml-3 flex-1 py-3.5 font-montserrat text-sm text-black"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
                Email Address
              </Text>
              <View 
                className={`flex-row items-center rounded-xl border-2 bg-gray-50 px-4 ${
                  emailFocused ? 'border-[#008000]' : 'border-gray-200'
                }`}
              >
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={emailFocused ? "#008000" : "#9ca3af"} 
                />
                <TextInput
                  className="ml-3 flex-1 py-3.5 font-montserrat text-sm text-black"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Birthdate Input */}
            <View className="mb-6">
              <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
                Date of Birth
              </Text>
              <View 
                className={`flex-row items-center rounded-xl border-2 bg-gray-50 px-4 ${
                  birthdateFocused ? 'border-[#008000]' : 'border-gray-200'
                }`}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={20} 
                  color={birthdateFocused ? "#008000" : "#9ca3af"} 
                />
                <TextInput
                  className="ml-3 flex-1 py-3.5 font-montserrat text-sm text-black"
                  value={birthdate}
                  onChangeText={setBirthdate}
                  placeholder="Enter your birthdate"
                  placeholderTextColor="#9ca3af"
                  onFocus={() => setBirthdateFocused(true)}
                  onBlur={() => setBirthdateFocused(false)}
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              className="mb-4 h-14 items-center justify-center rounded-xl bg-[#008000] shadow-lg shadow-[#008000]/30"
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text className="font-montserrat-bold text-base text-white">
                  Save Changes
                </Text>
              </View>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              className="h-14 items-center justify-center rounded-xl border-2 border-gray-300 bg-gray-100"
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text className="font-montserrat-semibold text-base text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>

            {/* Bottom Spacing */}
            <View className="h-10" />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
};

export default EditProfile;