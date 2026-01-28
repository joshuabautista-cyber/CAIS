import { View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { Text } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ChangePassword = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  
  // Responsive values
  const containerHeight = isLandscape ? '95%' : '90%';
  const contentMaxWidth = isTablet ? 600 : '100%';
  const horizontalPadding = isTablet ? 40 : 24;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentFocused, setCurrentFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const handleChangePassword = () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    // Add your password change logic here
    Alert.alert('Success', 'Password changed successfully', [
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
            <View className="mb-6">
              <Text className="font-montserrat-bold text-2xl text-[#008000]">
                Change Password
              </Text>
              <Text className="mt-1 font-montserrat text-sm text-gray-600">
                Please enter your current password and choose a new password
              </Text>
            </View>

            {/* Security Notice */}
            <View className="mb-6 rounded-xl bg-[#fff3cd] border-l-4 border-[#ffc107] p-4">
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark-outline" size={20} color="#856404" />
                <Text className="ml-2 font-montserrat-medium text-sm text-[#856404]">
                  For your security, use a strong password
                </Text>
              </View>
            </View>

            {/* Current Password */}
            <View className="mb-4">
              <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
                Current Password
              </Text>
              <View 
                className={`flex-row items-center rounded-xl border-2 bg-gray-50 px-4 ${
                  currentFocused ? 'border-[#008000]' : 'border-gray-200'
                }`}
              >
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={currentFocused ? "#008000" : "#9ca3af"} 
                />
                <TextInput
                  className="ml-3 flex-1 py-3.5 font-montserrat text-sm text-black"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                  onFocus={() => setCurrentFocused(true)}
                  onBlur={() => setCurrentFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Ionicons
                    name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-4">
              <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
                New Password
              </Text>
              <View 
                className={`flex-row items-center rounded-xl border-2 bg-gray-50 px-4 ${
                  newFocused ? 'border-[#008000]' : 'border-gray-200'
                }`}
              >
                <Ionicons 
                  name="key-outline" 
                  size={20} 
                  color={newFocused ? "#008000" : "#9ca3af"} 
                />
                <TextInput
                  className="ml-3 flex-1 py-3.5 font-montserrat text-sm text-black"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  onFocus={() => setNewFocused(true)}
                  onBlur={() => setNewFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons
                    name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
              <Text className="mt-1 font-montserrat text-xs text-gray-500">
                Must be at least 8 characters
              </Text>
            </View>

            {/* Confirm New Password */}
            <View className="mb-6">
              <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
                Confirm New Password
              </Text>
              <View 
                className={`flex-row items-center rounded-xl border-2 bg-gray-50 px-4 ${
                  confirmFocused ? 'border-[#008000]' : 'border-gray-200'
                }`}
              >
                <Ionicons 
                  name="checkmark-circle-outline" 
                  size={20} 
                  color={confirmFocused ? "#008000" : "#9ca3af"} 
                />
                <TextInput
                  className="ml-3 flex-1 py-3.5 font-montserrat text-sm text-black"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Change Password Button */}
            <TouchableOpacity
              className="mb-4 h-14 items-center justify-center rounded-xl bg-[#008000] shadow-lg shadow-[#008000]/30"
              onPress={handleChangePassword}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text className="font-montserrat-bold text-base text-white">
                  Update Password
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

export default ChangePassword;