import { View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            <Text className="text-lg text-white italic">Change Password</Text>
          </View>
        </View>
      </View>

      <View className="bg-white w-full h-[85%] rounded-t-[30px] absolute bottom-0 p-5">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="pt-5 pb-10">
            <Text className="text-xl font-semibold text-black mb-2.5">Security</Text>
            <Text className="text-sm text-gray-600 mb-6">Please enter your current password and choose a new password</Text>

            {/* Current Password */}
            <View className="mb-5">
              <Text className="text-base text-gray-800 mb-2 font-medium">Current Password</Text>
              <View className="flex-row items-center bg-gray-100 border border-[#65d15bff] rounded-xl">
                <TextInput
                  className="flex-1 p-4 text-base text-black"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="p-4"
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-5">
              <Text className="text-base text-gray-800 mb-2 font-medium">New Password</Text>
              <View className="flex-row items-center bg-gray-100 border border-[#65d15bff] rounded-xl">
                <TextInput
                  className="flex-1 p-4 text-base text-black"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="p-4"
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-xs text-gray-600 mt-1">Must be at least 8 characters</Text>
            </View>

            {/* Confirm New Password */}
            <View className="mb-5">
              <Text className="text-base text-gray-800 mb-2 font-medium">Confirm New Password</Text>
              <View className="flex-row items-center bg-gray-100 border border-[#65d15bff] rounded-xl">
                <TextInput
                  className="flex-1 p-4 text-base text-black"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="p-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Change Password Button */}
            <TouchableOpacity 
              className="bg-[#60c047ff] py-4 rounded-xl items-center mt-2.5 shadow-md"
              onPress={handleChangePassword}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text className="text-white text-lg font-bold">Change Password</Text>
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

export default ChangePassword;