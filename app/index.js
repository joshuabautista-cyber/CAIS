import React, { useState } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import clsu from "../assets/images/clsuLogoGreen.png";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.107.151:8000/api';

export default function App() {
  const router = useRouter();
  const [email, setEmail] = useState('student@test.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Logging in...');
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password
      });

      if (response.status === 200) {
        // Store user data if returned
        if (response.data.user) {
          await AsyncStorage.setItem('user_id', String(response.data.user.user_id || response.data.user.id));
          await AsyncStorage.setItem('token', response.data.token || '');
        }
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#FFD700", "#008000", "#004d00"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-6 py-7">
            {/* Logo Section */}
            <View className="items-center mb-6">
              <View className="h-[200px] w-[200px] items-center justify-center mb-4">
                <Image 
                  source={clsu} 
                  className="h-full w-full" 
                  resizeMode="contain"
                />
              </View>
              <Text className="text-center font-montserrat-bold text-2xl text-[#FFD700] mb-1 drop-shadow-lg">
                CLSU Portal
              </Text>
              <Text className="text-center font-montserrat-medium text-sm text-white/95">
                Comprehensive Academic Information System
              </Text>
            </View>

            {/* Login Card */}
            <View className="w-full rounded-3xl bg-white/85 p-6 shadow-2xl shadow-black/30">
              <View className="mb-6">
                <Text className="font-montserrat-bold text-2xl text-[#008000]">
                  Welcome Back
                </Text>
                <Text className="mt-1 font-montserrat text-sm text-gray-600">
                  Sign in to continue to the portal
                </Text>
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
                    placeholder="Enter your email"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-2">
                <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
                  Password
                </Text>
                <View 
                  className={`flex-row items-center rounded-xl border-2 bg-gray-50 px-4 ${
                    passwordFocused ? 'border-[#008000]' : 'border-gray-200'
                  }`}
                >
                  <Ionicons 
                    name="lock-closed-outline" 
                    size={20} 
                    color={passwordFocused ? "#008000" : "#9ca3af"} 
                  />
                  <TextInput
                    className="ml-3 flex-1 py-3.5 font-montserrat text-sm text-black"
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-2"
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <Pressable onPress={() => Alert.alert("Forgot Password", "Password reset feature coming soon")}>
                <Text className="mb-6 text-right font-montserrat-medium text-xs text-[#008000]">
                  Forgot Password?
                </Text>
              </Pressable>

              {/* Login Button */}
              <TouchableOpacity
                className={`mb-4 h-14 items-center justify-center rounded-xl shadow-lg shadow-[#008000]/30 ${
                  loading ? 'bg-gray-400' : 'bg-[#008000]'
                }`}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <View className="flex-row items-center">
                    <Text className="font-montserrat-bold text-base text-white">
                      Sign In
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="my-4 flex-row items-center">
                <View className="h-[1px] flex-1 bg-gray-300" />
                <Text className="mx-3 font-montserrat text-xs text-gray-500">OR</Text>
                <View className="h-[1px] flex-1 bg-gray-300" />
              </View>

              {/* Schedule Button */}
              <TouchableOpacity
                className="h-14 items-center justify-center rounded-xl border-2 border-[#008000] bg-white"
                onPress={() => router.push("/subjects-schedule")}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={18} color="#008000" />
                  <Text className="ml-2 font-montserrat-bold text-sm text-[#008000]">
                    View Subjects Schedule
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}