import { StyleSheet, View, Image, TouchableOpacity, Alert, Text } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ IMPORT THIS

const Profile = () => {
  const router = useRouter(); 

  // Navigation handlers
  const handleEditProfile = () => {
    router.push('/(settings)/editprofile');
  };

  const handleChangePassword = () => {
    router.push('/(settings)/changepassword');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // ✅ DESTROY THE TOKEN
              await AsyncStorage.removeItem('token');
              
              // Navigate back to login
              router.replace('/'); 
            } catch (error) {
              console.error("Logout error:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <View className='flex-1 bg-white'>
        <View className='h-[250px] bg-green-200 justify-center items-center rounded-br-[150px] shadow-lg overflow-hidden'> 
            <View className='w-[130px] h-[130px] bg-white rounded-full justify-center items-center shadow-lg mt-10'> 
                <Image 
                  // Placeholder image; replace with user profile image if available
                  source={{ uri: 'https://via.placeholder.com/150' }} 
                  className='w-[120px] h-[120px] rounded-full'
                />
            </View>
            <Text className='font-montserrat-bold text-xl mt-3 text-green-900'>User Name</Text>
        </View>

        <View className='h-[8%] mt-5 border-t border-b border-green-500 flex-row justify-between items-center px-[15px]'>
          <Text className='font-montserrat text-lg text-black'>No. of Stay</Text>
          <Text className='font-montserrat text-lg text-black'>N/A</Text>
        </View>

        <View className='justify-center items-center mt-5'>
          <Text className='font-montserrat text-base text-green-600'>September 1, 1939</Text>
        </View>

        <View className='flex-col justify-center mt-10 gap-5 px-6'>
        
          <TouchableOpacity 
            className='bg-green-200 w-full h-[50] rounded justify-center items-center shadow-sm' 
            onPress={handleEditProfile}>
            <Text className='font-montserrat-semibold text-base text-green-900'>Edit Profile</Text>
          </TouchableOpacity>
        
          <TouchableOpacity 
            className='bg-green-200 w-full h-[50] rounded justify-center items-center shadow-sm'
            onPress={handleChangePassword}>
            <Text className='font-montserrat-semibold text-base text-green-900'>Change Password</Text>
          </TouchableOpacity>
        
          <TouchableOpacity 
            className='bg-red-500 w-full h-[50] rounded justify-center items-center shadow-sm mt-5'
            onPress={handleLogout}>
            <Text className='font-montserrat-semibold text-base text-white'>Logout</Text>
          </TouchableOpacity>
          
        </View>
    </View>
  );
};

export default Profile;