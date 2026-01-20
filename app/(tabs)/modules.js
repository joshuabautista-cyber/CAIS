import { View, Image , TouchableOpacity} from 'react-native';
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

const Modules = () => {

  const router = useRouter(); // Initialize the router
  
    // Navigation handlers
    const handleEnrollment = () => {
      router.push('/(modules)/enrollment');
    };
  
    const handleGraduation = () => {
      router.push('/(modules)/graduation');
    };

    const handleLOA = () => {
      router.push('/(modules)/loa');
    };
  
    const handlePreregistration = () => {
      router.push('/(modules)/prereg');
    };

    const handlePRTF = () => {
      router.push('/(modules)/prtf');
    };
  
    const handleRequestForm = () => {
      router.push('/(modules)/req_form');
    };




  return (
    <LinearGradient
      colors={['#8ddd9eff', '#11581bff', '#12521dff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className = "bg-white w-[100%] h-[85%] absolute bottom-0 rounded-t-2xl">

        {/* Wrap image in a View for shadow compatibility */}
        <View className = "w-[120px] h-[120px] rounded-full top-[-60px] left-[30px] absolute z-10 bg-white shadow-lg shadow-black">
          <Image source={clsuLogoGreen} className = "w-full h-full rounded-full" />
        </View>

        <View className='justify-center items-center mt-[8%]'>
          <Text className='font-montserrat-bold text-2xl text-center text-green-600'> CAIS {"\n"}Modules</Text>
        </View>

        <View className='justify-flex-start items-center mt-20 w-full'>

        <View className='justify-flex-start items-center w-full' flexDirection='column'>
          <TouchableOpacity className='bg-green-600 w-[80%] h-16 justify-center items-start pl-5 rounded-xl my-2.5' onPress={handlePreregistration} >
            <Text className='font-montserrat-medium text-white text-base'>Pre-Registration</Text>
          </TouchableOpacity>
          <TouchableOpacity className='bg-green-600 w-[80%] h-16 justify-center items-start pl-5 rounded-xl my-2.5' onPress={handleEnrollment} >
            <Text className='font-montserrat-medium text-white text-base'>Enrollment</Text>
            </TouchableOpacity>
          <TouchableOpacity className='bg-green-600 w-[80%] h-16 justify-center items-start pl-5 rounded-xl my-2.5' onPress={handleGraduation} >
            <Text className='font-montserrat-medium text-white text-base'>Application for Graduation</Text>
            </TouchableOpacity>
          <TouchableOpacity className='bg-green-600 w-[80%] h-16 justify-center items-start pl-5 rounded-xl my-2.5' onPress={handlePRTF} >
            <Text className='font-montserrat-medium text-white text-base'>Online PRTF</Text>
            </TouchableOpacity>
          <TouchableOpacity className='bg-green-600 w-[80%] h-16 justify-center items-start pl-5 rounded-xl my-2.5' onPress={handleLOA} >
            <Text className='font-montserrat-medium text-white text-base'>Leave of Absence</Text>
            </TouchableOpacity>
          <TouchableOpacity className='bg-green-600 w-[80%] h-16 justify-center items-start pl-5 rounded-xl my-2.5' onPress={handleRequestForm} >
            <Text className='font-montserrat-medium text-white text-base'>Request Form</Text>
            </TouchableOpacity>
        </View>

        </View>

      </View>
    </LinearGradient>
  );
};

export default Modules;