import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ForgotPassword = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  
  // Responsive values
  const contentMaxWidth = isTablet ? 500 : '100%';
  const horizontalPadding = isTablet ? 40 : 24;

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call - replace with actual API endpoint
    try {
      // TODO: Replace with actual API call
      // const response = await axios.post(`${API_URL}/forgot-password`, { email });
      
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
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
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={handleBackToLogin} 
            className="flex-row items-center mb-2"
            style={{ marginTop: isLandscape ? 8 : 16 }}
          >
            <Ionicons name="arrow-back" size={24} color="#008000" />
            <Text className="ml-2 font-montserrat-medium text-[#008000]">Back to Login</Text>
          </TouchableOpacity>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              maxWidth: contentMaxWidth,
              alignSelf: 'center',
              width: '100%',
              paddingBottom: 40,
              flexGrow: 1,
            }}
          >
            {!emailSent ? (
              <>
                {/* Header */}
                <View className="mb-6 mt-4">
                  <View className="h-20 w-20 rounded-full bg-[#008000]/10 items-center justify-center self-center mb-4">
                    <Ionicons name="lock-closed-outline" size={40} color="#008000" />
                  </View>
                  <Text className="font-montserrat-bold text-2xl text-[#008000] text-center">
                    Forgot Password?
                  </Text>
                  <Text className="mt-2 font-montserrat text-sm text-gray-600 text-center px-4">
                    Don't worry! Enter your email address and we'll send you a link to reset your password.
                  </Text>
                </View>

                {/* Email Input */}
                <View className="mb-6">
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
                      placeholder="Enter your registered email"
                      placeholderTextColor="#9ca3af"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      editable={!loading}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  className={`mb-4 h-14 items-center justify-center rounded-xl shadow-lg ${
                    loading ? 'bg-gray-400' : 'bg-[#008000]'
                  }`}
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <View className="flex-row items-center">
                      <Ionicons name="send" size={18} color="#fff" style={{ marginRight: 8 }} />
                      <Text className="font-montserrat-bold text-base text-white">
                        Send Reset Link
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Info Box */}
                <View className="mt-4 rounded-xl bg-[#fff3cd] border-l-4 border-[#ffc107] p-4">
                  <View className="flex-row items-start">
                    <Ionicons name="information-circle-outline" size={20} color="#856404" style={{ marginTop: 2 }} />
                    <View className="ml-2 flex-1">
                      <Text className="font-montserrat-medium text-sm text-[#856404]">
                        Important
                      </Text>
                      <Text className="font-montserrat text-xs text-[#856404] mt-1">
                        Make sure to check your spam folder if you don't see the email in your inbox.
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              /* Success State */
              <View className="flex-1 items-center justify-center px-4">
                <View className="h-24 w-24 rounded-full bg-[#008000]/10 items-center justify-center mb-6">
                  <Ionicons name="checkmark-circle" size={60} color="#008000" />
                </View>
                <Text className="font-montserrat-bold text-2xl text-[#008000] text-center mb-3">
                  Email Sent!
                </Text>
                <Text className="font-montserrat text-sm text-gray-600 text-center mb-8 px-4">
                  We've sent a password reset link to{'\n'}
                  <Text className="font-montserrat-bold text-[#008000]">{email}</Text>
                </Text>
                
                <View className="w-full bg-[#e8f5e9] rounded-xl p-4 mb-6">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="time-outline" size={18} color="#008000" />
                    <Text className="font-montserrat-medium text-sm text-[#008000] ml-2">
                      Link expires in 24 hours
                    </Text>
                  </View>
                  <Text className="font-montserrat text-xs text-gray-600">
                    Please check your email and click the reset link to create a new password.
                  </Text>
                </View>

                {/* Resend Button */}
                <TouchableOpacity
                  className="mb-4 h-14 w-full items-center justify-center rounded-xl bg-[#008000]"
                  onPress={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="refresh" size={18} color="#fff" style={{ marginRight: 8 }} />
                    <Text className="font-montserrat-bold text-base text-white">
                      Try Different Email
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Back to Login Button */}
                <TouchableOpacity
                  className="h-14 w-full items-center justify-center rounded-xl border-2 border-[#008000] bg-white"
                  onPress={handleBackToLogin}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="log-in-outline" size={18} color="#008000" style={{ marginRight: 8 }} />
                    <Text className="font-montserrat-bold text-base text-[#008000]">
                      Back to Login
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Bottom Spacing */}
            <View className="h-10" />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
};

export default ForgotPassword;
