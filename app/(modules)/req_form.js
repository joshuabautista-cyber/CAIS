import React from "react";
import { View, TouchableOpacity, Image} from "react-native";
import { Text } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from '../../assets/images/clsuLogoGreen.png';
import { navigate } from "expo-router/build/global-state/routing";

const req_form = () => {

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

        {/* Main Container */}
        <View className="bg-white w-full h-[85%] rounded-t-[30px] absolute bottom-0 p-8">
          
          {/* Centered Content Card - pushed down */}
          <View className="flex-1 justify-center items-center w-[100%] h-[90%] ">
            <View 
              className="bg-gray-50 rounded-3xl p-8 w-full mx-4 border-2 border-gray-200"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 15,
                elevation: 10,
              }}
            >
              {/* Title */}
              <Text className="font-montserrat-bold text-2xl text-green-700 text-center mb-3">
                Request Form
              </Text>
              
              {/* Subtitle */}
              <Text className="font-montserrat text-base text-gray-600 text-center mb-8">
                Click on the button below!
              </Text>
              
              {/* Apply Button */}
              <TouchableOpacity 
                className="bg-green-600 py-4 px-8 rounded-xl items-center"
                onPress={() => navigate('/(modules)/graduationForm')}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 6,
                }}
              >
                <Text className="font-montserrat-bold text-white text-lg">Request Now</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>

      </View>
    </LinearGradient>
  )
}

export default req_form