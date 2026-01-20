import { StyleSheet, View, Image , TouchableOpacity} from 'react-native';
import { Text } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Dropdown } from 'react-native-element-dropdown';
import { AntDesign } from '@expo/vector-icons';
import { navigate } from 'expo-router/build/global-state/routing';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

const profile = () => {

   const router = useRouter(); // Initialize the router

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
          onPress: () => {
            // Add your logout logic here
            router.replace('/'); // Navigate to login/home screen
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#8ddd9eff', '#11581bff', '#12521dff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ position: 'absolute', top: 30, left: 0, right: 0, alignItems: 'center', width: '100%', paddingTop: 16, zIndex: 10 }}>
        <Text className='font-montserrat-bold text-2xl text-white mb-4'>CAIS</Text>
        <Text className='font-montserrat text-base text-white mb-4'>Profile Settings</Text>
      </View>

      <View className='bg-white w-full h-[80%] rounded-t-2xl absolute bottom-0 p-5'>

        {/* Wrap image in a View for shadow compatibility */}
        <View className='w-[160px] h-[160px] left-[33%] rounded-[80px] top-[-50px] absolute z-10 bg-white' style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 8,
        }}>
          <Image source={clsuLogoGreen} className='w-full h-full rounded-60'/>
        </View>

        <View className='mt-[30%] flex-col justify-center items-center'>
          <Text className='font-montserrat-semibold text-2xl text-green-600 p-1'>Liane Jonyl A. Tomas</Text>
          <Text className='font-montserrat text-2xl text-green-600 p-1'>liane.tomas@clsu2.edu.ph</Text>
          <Text className='font-montserrat-medium text-2xl text-green-600 p-1'>STUDENT</Text>
        </View>

        <View className='h-[8%] mt-5 border-t border-b border-green-500 flex-row justify-between items-center px-[15px]'>
          <Text className='font-montserrat text-lg text-black'>No. of Stay</Text>
          <Text className='font-montserrat text-lg text-black'>N/A</Text>
        </View>

        <View className='justify-center items-center mt-5'>
          <Text className='font-montserrat text-base text-green-600'>September 1, 1939</Text>
        </View>

        <View className='flex-col justify-center mt-10 gap-8'>
        
        <TouchableOpacity 
          className='bg-green-200 w-full h-[50] rounded mt-15 justify-center items-center' 
          onPress={handleEditProfile}>
          <Text className='font-montserrat-semibold text-base'>Edit Profile</Text>
        </TouchableOpacity>
      
        <TouchableOpacity 
          className='bg-green-200 w-full h-[50] rounded mt-15 justify-center items-center'
          onPress={handleChangePassword}>
          <Text className='font-montserrat-semibold text-base'>Change Password</Text>
        </TouchableOpacity>
      
        <TouchableOpacity 
          className='bg-green-200 w-full h-[50] rounded mt-15 justify-center items-center'
          onPress={handleLogout}>
          <Text className='font-montserrat-semibold text-base'>Logout</Text>
        </TouchableOpacity>

        </View>

      </View>
    </LinearGradient>
  );
};

export default profile;