import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a5419',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarActiveTintColor: '#ffd700',
        tabBarInactiveTintColor: '#fff',
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      
      {/* Registration Tab */}
      <Tabs.Screen
        name="registration"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#ffd700' : 'transparent',
              borderRadius: 28,
              width: 56,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons 
                name="calendar" 
                size={28} 
                color={focused ? '#0a4d15' : '#fff'}
              />
            </View>
          ),
        }}
      />
      
      {/* Grades Tab */}
      <Tabs.Screen
        name="grades"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#ffd700' : 'transparent',
              borderRadius: 28,
              width: 56,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialCommunityIcons 
                name="school" 
                size={28} 
                color={focused ? '#0a4d15' : '#fff'}
              />
            </View>
          ),
        }}
      />
      
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#ffd700' : 'transparent',
              borderRadius: 28,
              width: 56,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons 
                name="home" 
                size={28} 
                color={focused ? '#0a4d15' : '#fff'}
              />
            </View>
          ),
        }}
      />
      
      {/* Modules Tab */}
      <Tabs.Screen
        name="modules"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#ffd700' : 'transparent',
              borderRadius: 28,
              width: 56,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons 
                name="book" 
                size={28} 
                color={focused ? '#0a4d15' : '#fff'}
              />
            </View>
          ),
        }}
      />
      
      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#ffd700' : 'transparent',
              borderRadius: 28,
              width: 56,
              height: 56,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons 
                name="person-circle" 
                size={28} 
                color={focused ? '#0a4d15' : '#fff'}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}