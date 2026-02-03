import { View, Image, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.107.151:8000/api';

const Profile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // State for user data
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    userType: '',
    birthdate: '',
  });
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  
  // Responsive values
  const avatarSize = isLandscape ? (isTablet ? 140 : 120) : 160;
  const logoTop = isLandscape ? (isTablet ? -70 : -60) : -80;
  const cardHeight = isLandscape ? '90%' : '80%';
  const headerMarginTop = isLandscape ? 80 : 100;
  const titleSize = isTablet ? 'text-3xl' : 'text-2xl';
  const buttonPadding = isLandscape ? 12 : 14;
  const buttonGap = isLandscape ? 12 : 16;

  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('user_id');
      
      if (!userId) {
        console.log('No user_id found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/applicant-profile/user/${userId}`);
      
      if (response.data.success && response.data.data) {
        const profile = response.data.data;
        
        // Format full name
        const middleInitial = profile.middlename ? `${profile.middlename.charAt(0)}.` : '';
        const fullName = [profile.firstname, middleInitial, profile.lastname, profile.suffix]
          .filter(Boolean)
          .join(' ');
        
        // Format birthdate
        let formattedBirthdate = 'N/A';
        if (profile.date_of_birth) {
          const date = new Date(profile.date_of_birth);
          formattedBirthdate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }

        setUserData({
          fullName: fullName || 'N/A',
          email: profile.student_email || 'N/A',
          userType: 'STUDENT',
          birthdate: formattedBirthdate,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

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
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear stored tokens/data
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user_id');
              router.replace('/');
            } catch (error) {
              console.error("Logout error:", error);
              router.replace('/');
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#008000', '#006400', '#004d00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      {/* White Card Container */}
      <View 
        className='absolute bottom-0 w-full rounded-t-3xl bg-white'
        style={{ height: cardHeight }}
      >
        {/* Centered overlapping logo */}
        <View 
          className="absolute z-10 self-center rounded-full bg-white shadow-lg"
          style={{
            top: logoTop,
            width: avatarSize,
            height: avatarSize,
          }}
        >
          <Image 
            source={clsuLogoGreen} 
            style={{ 
              width: avatarSize, 
              height: avatarSize, 
              borderRadius: avatarSize / 2 
            }}
          />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingHorizontal: isTablet ? 40 : 20,
            paddingBottom: insets.bottom + 20
          }}
        >
          {/* Header Title */}
          <View className='items-center' style={{ marginTop: headerMarginTop }}>
            <Text className={`font-montserrat-bold ${titleSize} text-[#008000]`}>Profile Settings</Text>
          </View>

          {/* User Info */}
          {loading ? (
            <View className='items-center mt-5 py-8'>
              <ActivityIndicator size="large" color="#008000" />
              <Text className='font-montserrat text-gray-500 mt-2'>Loading profile...</Text>
            </View>
          ) : (
            <View className='items-center mt-5'>
              <Text className={`font-montserrat-semibold ${isTablet ? 'text-2xl' : 'text-xl'} text-[#008000] py-1`}>{userData.fullName}</Text>
              <Text className={`font-montserrat ${isTablet ? 'text-lg' : 'text-base'} text-[#008000] py-1`}>{userData.email}</Text>
              <Text className={`font-montserrat-medium ${isTablet ? 'text-lg' : 'text-base'} text-[#008000] py-1`}>{userData.userType}</Text>
            </View>
          )}

          {/* Stay Info */}
          <View className='border-t border-b border-[#008000] flex-row justify-between items-center px-4 py-3 mt-5'>
            <Text className={`font-montserrat ${isTablet ? 'text-lg' : 'text-base'} text-black`}>No. of Stay</Text>
            <Text className={`font-montserrat ${isTablet ? 'text-lg' : 'text-base'} text-black`}>N/A</Text>
          </View>

          {/* Birthdate */}
          <View className='items-center py-4'>
            <Text className={`font-montserrat ${isTablet ? 'text-base' : 'text-sm'} text-[#008000]`}>{loading ? 'Loading...' : userData.birthdate}</Text>
          </View>

          {/* Buttons */}
          <View style={{ gap: buttonGap, marginTop: isLandscape ? 8 : 16 }}>
            <TouchableOpacity 
              className='bg-[#008000] rounded-xl justify-center items-center'
              style={{ paddingVertical: buttonPadding }}
              onPress={handleEditProfile}
            >
              <Text className={`font-montserrat-semibold ${isTablet ? 'text-lg' : 'text-base'} text-white`}>Edit Profile</Text>
            </TouchableOpacity>
          
            <TouchableOpacity 
              className='bg-[#008000] rounded-xl justify-center items-center'
              style={{ paddingVertical: buttonPadding }}
              onPress={handleChangePassword}
            >
              <Text className={`font-montserrat-semibold ${isTablet ? 'text-lg' : 'text-base'} text-white`}>Change Password</Text>
            </TouchableOpacity>
          
            <TouchableOpacity 
              className='bg-[#008000] rounded-xl justify-center items-center'
              style={{ paddingVertical: buttonPadding }}
              onPress={handleLogout}
            >
              <Text className={`font-montserrat-semibold ${isTablet ? 'text-lg' : 'text-base'} text-white`}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Profile;