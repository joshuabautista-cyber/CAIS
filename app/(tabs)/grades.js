import { Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import clsuLogoGreen from "../../assets/images/clsuLogoGreen.png";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";

const Grades = () => {
  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          className={`font-montserrat-medium absolute left-[22px] top-2 z-[999] bg-white px-2 text-sm ${
            isFocus ? "text-black" : "text-gray-700"
          }`}
        >
          Select Semester
        </Text>
      );
    }
    return null;
  };

  return (
    <LinearGradient
      colors={["#8ddd9eff", "#11581bff", "#12521dff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="absolute bottom-0 h-[85%] w-full rounded-t-3xl bg-white p-5">
        {/* Logo */}
        <View className="absolute -top-16 left-8 z-10 h-[120px] w-[120px] rounded-full bg-white shadow-lg shadow-black">
          <Image
            source={clsuLogoGreen}
            className="h-full w-full rounded-full"
          />
        </View>

        <View className="mt-8 items-center justify-center">
          <Text className="font-montserrat-medium mb-5 text-center text-xl text-black">
            CAIS {"\n"}Grades
          </Text>
        </View>

        <View className="bg-white p-4">
          {renderLabel()}
          <Dropdown
            style={{
              height: 50,
              borderColor: isFocus ? "#7cc364ff" : "#7cc364ff",
              borderWidth: 0.5,
              borderRadius: 8,
              paddingHorizontal: 8,
              fontFamily: 'Montserrat-Regular',
            }}
            placeholderStyle={{ fontSize: 16, fontFamily: 'Montserrat-Regular' }}
            selectedTextStyle={{ fontSize: 16, fontFamily: 'Montserrat-Regular' }}
            iconStyle={{ width: 20, height: 20 }}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "-Select Semester-" : "..."}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={{ marginRight: 10 }}
                color={isFocus ? "#7cc364ff" : "#7cc364ff"}
                name="book"
                size={20}
              />
            )}
          />
        </View>

        <View className="mt-6 items-center justify-center">
          <TouchableOpacity
            className="h-10 w-40 items-center justify-center rounded bg-[#60c047ff]"
            onPress={() => Alert.alert("Download pressed")}
          >
            <Text className="font-montserrat-bold text-white">Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Grades;