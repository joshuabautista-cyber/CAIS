import { View, Image, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { Text } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import clsuLogoGreen from '../../assets/images/clsu.png';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Modules = () => {
  const router = useRouter();
  const [expandedModule, setExpandedModule] = useState(null);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  const isLargeTablet = width >= 1024;
  
  // Responsive values
  const logoSize = isLandscape ? (isTablet ? 100 : 90) : 120;
  const logoTop = isLandscape ? -50 : -60;
  const cardHeight = isLandscape ? '90%' : '85%';
  const headerMarginTop = isLandscape ? 60 : 80;
  const titleSize = isTablet ? 'text-3xl' : 'text-2xl';
  const gridColumns = isLargeTablet ? 2 : 1;
  
  const modules = [
    {
      title: 'Pre-Registration',
      icon: 'calendar-outline',
      iconType: 'ionicons',
      onPress: () => router.push('/(modules)/prereg'),
      color: '#008000'
    },
    {
      title: 'Enrollment',
      icon: 'school-outline',
      iconType: 'ionicons',
      color: '#008000',
      hasDropdown: true,
      subModules: [
        {
          title: 'Regular',
          icon: 'calendar-outline',
          onPress: () => router.push('/(modules)/regular')
        },
        {
          title: 'Online PRTF',
          icon: 'document-text-outline',
          onPress: () => router.push('/(modules)/prtf')
        },
        {
          title: 'Adding and Changing',
          icon: 'add-circle-outline',
          onPress: () => router.push('/(modules)/adding')
        },
        {
          title: 'Dropping',
          icon: 'remove-circle-outline',
          onPress: () => router.push('/(modules)/dropping')
        }
      ]
    },
    {
      title: 'Application for Graduation',
      icon: 'school',
      iconType: 'material',
      onPress: () => router.push('/(modules)/graduation'),
      color: '#008000'
    },
    {
      title: 'Leave of Absence',
      icon: 'time-outline',
      iconType: 'ionicons',
      onPress: () => router.push('/(modules)/loa'),
      color: '#008000'
    },
    {
      title: 'Request Form',
      icon: 'document-attach-outline',
      iconType: 'ionicons',
      onPress: () => router.push('/(modules)/req_form'),
      color: '#008000'
    }
  ];

  const toggleDropdown = (index) => {
    setExpandedModule(expandedModule === index ? null : index);
  };

  return (
    <LinearGradient
      colors={['#008000', '#006400', '#004d00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <View 
        className="absolute bottom-0 w-full rounded-t-3xl bg-white"
        style={{ height: cardHeight }}
      >
        {/* Logo */}
        <View 
          className="absolute z-10 rounded-full bg-white shadow-lg"
          style={{
            left: 30,
            top: logoTop,
            width: logoSize,
            height: logoSize,
          }}
        >
          <Image 
            source={clsuLogoGreen} 
            style={{ width: logoSize, height: logoSize, borderRadius: logoSize / 2 }}
          />
        </View>

        {/* Header */}
        <View className="items-center justify-center" style={{ marginTop: headerMarginTop }}>
          <Text className={`text-center font-montserrat-bold ${titleSize} text-[#008000]`}>
            CAIS Modules
          </Text>
          <Text className="mt-1 text-center font-montserrat text-sm text-gray-600">
            Select a module to get started
          </Text>
        </View>

        {/* Modules Grid */}
        <ScrollView 
          className="flex-1 px-5"
          style={{ marginTop: isLandscape ? 16 : 32 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingBottom: insets.bottom + 20,
            flexDirection: gridColumns > 1 ? 'row' : 'column',
            flexWrap: gridColumns > 1 ? 'wrap' : 'nowrap',
            justifyContent: gridColumns > 1 ? 'space-between' : 'flex-start',
          }}
        >
          {modules.map((module, index) => (
            <View 
              key={index} 
              className="mb-4"
              style={{ 
                width: gridColumns > 1 ? '48%' : '100%',
              }}
            >
                {/* Main Module */}
                <TouchableOpacity
                  className="overflow-hidden rounded-2xl bg-white shadow-md shadow-gray-400"
                  onPress={() => module.hasDropdown ? toggleDropdown(index) : module.onPress()}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#008000', '#006400']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="flex-row items-center p-4"
                  >
                    {/* Icon Container */}
                    <View className="mr-4 h-14 w-14 items-center justify-center rounded-full bg-white/20">
                      {module.iconType === 'ionicons' ? (
                        <Ionicons name={module.icon} size={28} color="#fff" />
                      ) : (
                        <MaterialCommunityIcons name={module.icon} size={28} color="#fff" />
                      )}
                    </View>

                    {/* Text Content */}
                    <View className="flex-1">
                      <Text className="font-montserrat-bold text-base text-white">
                        {module.title}
                      </Text>
                    </View>

                    {/* Arrow Icon */}
                    <Ionicons 
                      name={module.hasDropdown ? (expandedModule === index ? "chevron-up" : "chevron-down") : "chevron-forward"} 
                      size={24} 
                      color="#fff" 
                    />
                  </LinearGradient>
                </TouchableOpacity>

                {/* Dropdown Sub-modules */}
                {module.hasDropdown && expandedModule === index && (
                  <View className="mt-2 ml-4 overflow-hidden rounded-xl bg-gray-50">
                    {module.subModules.map((subModule, subIndex) => (
                      <TouchableOpacity
                        key={subIndex}
                        className="flex-row items-center border-b border-gray-200 p-4"
                        onPress={subModule.onPress}
                        activeOpacity={0.7}
                      >
                        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#FFD700]/20">
                          <Ionicons name={subModule.icon} size={20} color="#008000" />
                        </View>
                        <Text className="flex-1 font-montserrat-medium text-sm text-[#008000]">
                          {subModule.title}
                        </Text>
                        <Ionicons name="chevron-forward" size={18} color="#008000" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Modules;