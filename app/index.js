import React, { useState } from "react";
import {
  Image,
  View,
  // Text,
  TouchableOpacity,
  Alert,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Text } from 'react-native';
import clsu from "../assets/clsu.png";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from 'axios';

const API_URL = 'http://192.168.107.101:8000/api';

export default function App() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('adminpassword');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log('Logging in...');
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password
      });

      if (response.status === 200) {
        // Login successful - navigate to home
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
      colors={["#85c593ff", "#90e49bff", "#12521dff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1 flex-col items-center justify-center">
        {/* Top logo and title */}
        <View className="mt-[8%] mb-5 w-[75%] flex-row items-center rounded-2xl bg-white px-4 py-4 shadow-lg">
          <Image source={clsu} className="h-[150px] w-[150px]" />
          <Text className="ml-1 text-xs text-black font-bold">
            Comprehensive{"\n"}Academic{"\n"}Information System
          </Text>
        </View>

        {/* Login card */}
        <View className="h-[70%] w-[75%] rounded-2xl bg-white shadow-lg">
          <Text className="mt-8 ml-3 text-left text-3xl font-bold text-black">
            Welcome Back
          </Text>
          <Text className="mt-1 ml-3 text-m text-black">
            Sign in to Continue to the Portal
          </Text>

          <View className="mt-12">
            <Text className="ml-3 pt-2 text-s text-black">Email</Text>
            <TextInput
              className="mx-2 my-2 h-10 rounded border border-black px-2 text-black"
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            <Text className="ml-3 pt-2 text-s text-black">Password</Text>
            <TextInput
              className="mx-2 my-2 h-10 rounded border border-black px-2 text-black"
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              editable={!loading}
            />

            <TouchableOpacity
              className="mx-2 mt-6 h-10 items-center justify-center rounded bg-[#60c047ff]"
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-bold text-white">Login</Text>
              )}
            </TouchableOpacity>

            <Pressable onPress={() => Alert.alert("Forgot Password pressed")}>
              <Text className="mt-2 text-center text-[10px] text-blue-600">
                Forgot Password?
              </Text>
            </Pressable>

            <TouchableOpacity
              className="mt-12 h-[60px] w-[40%] self-center items-center justify-center rounded bg-[#60c047ff]"
              onPress={() => Alert.alert("Schedule button pressed")}
            >
              <Text className="text-center font-bold text-white">
                Subjects Schedule {"\n"} (Real Time)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}