import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.107.151:8000/api';

const EditProfile = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef(null);
  
  // Responsive breakpoints
  const isLandscape = width > height;
  const isTablet = width >= 768;
  
  // Responsive values
  const contentMaxWidth = isTablet ? 600 : '100%';
  const horizontalPadding = isTablet ? 40 : 24;

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  const steps = [
    { id: 1, title: 'Basic Information', icon: 'person-outline' },
    { id: 2, title: 'Personal Details', icon: 'information-circle-outline' },
    { id: 3, title: 'Address Information', icon: 'location-outline' },
    { id: 4, title: 'Family Background', icon: 'people-outline' },
    { id: 5, title: 'Academic Background', icon: 'school-outline' },
    { id: 6, title: 'PWD/Handicap', icon: 'accessibility-outline' },
    { id: 7, title: 'Minority Group', icon: 'people-circle-outline' },
    { id: 8, title: 'Family Income', icon: 'cash-outline' },
  ];

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstname: '',
    middlename: '',
    lastname: '',
    suffix: '',
    student_number: '22-1476', // readonly
    course: '(BSIT) BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY', // readonly
    student_mobile_contact: '',
    student_email: '',
    
    // Step 2: Personal Details
    civil_status: '',
    date_of_birth: '',
    place_of_birth: '',
    nationality: '',
    sex: '',
    gender: '',
    religion_id: '',
    birth_order: '',
    sibling_in_college: '',
    sibling_college_graduate: '',
    
    // Step 3: Address Information
    permanent_address: '',
    permanent_region: '',
    permanent_province: '',
    permanent_city: '',
    zipcode: '',
    country: '',
    same_as_permanent: false,
    clsu_address: '',
    clsu_region: '',
    clsu_province: '',
    clsu_city: '',
    clsu_zipcode: '',
    clsu_country: '',
    
    // Step 4: Family Background
    father_fname: '',
    father_mname: '',
    father_lname: '',
    father_contact: '',
    father_education: '',
    father_occupation: '',
    mother_fname: '',
    mother_mname: '',
    mother_lname: '',
    mother_contact: '',
    mother_education: '',
    mother_occupation: '',
    guardian_name: '',
    guardian_contact: '',
    emergency_person: '',
    
    // Step 5: Academic Background
    elementary_school: '',
    elementary_year: '',
    elementary_address: '',
    high_school: '',
    high_school_year: '',
    high_school_address: '',
    senior_high_school: '',
    senior_high_year: '',
    senior_high_address: '',
    
    // Step 6: PWD/Handicap
    disability: 'No',
    disability_type: '',
    disability_proof: '',
    
    // Step 7: Minority Group
    indigenous: 'No',
    indigenous_type: '',
    indigenous_proof: '',
    
    // Step 8: Family Income
    family_income: '',
    itr: '',
  });

  const [focusedField, setFocusedField] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem('user_id');
      
      if (!storedUserId) {
        Alert.alert('Error', 'User not logged in. Please login again.');
        router.replace('/');
        return;
      }
      
      setUserId(storedUserId);
      
      const response = await axios.get(`${API_URL}/applicant-profile/user/${storedUserId}`);
      
      if (response.data.success && response.data.data) {
        const profileData = response.data.data;
        
        // Map API data to form fields
        setFormData(prev => ({
          ...prev,
          // Basic Information
          firstname: profileData.firstname || '',
          middlename: profileData.middlename || '',
          lastname: profileData.lastname || '',
          suffix: profileData.suffix || '',
          student_mobile_contact: profileData.student_mobile_contact || '',
          student_email: profileData.student_email || '',
          course: profileData.course_program || prev.course,
          
          // Personal Details
          civil_status: profileData.civil_status || '',
          date_of_birth: profileData.date_of_birth || '',
          place_of_birth: profileData.place_of_birth || '',
          nationality: profileData.nationality || '',
          sex: profileData.sex || '',
          gender: profileData.gender || '',
          religion_id: profileData.religion_id?.toString() || '',
          birth_order: profileData.birth_order || '',
          sibling_in_college: profileData.sibling_in_college || '',
          sibling_college_graduate: profileData.sibling_college_graduate || '',
          
          // Address Information
          permanent_address: profileData.permanent_address || '',
          permanent_cluster: profileData.permanent_cluster || '',
          zipcode: profileData.zipcode || '',
          country: profileData.country || '',
          clsu_address: profileData.clsu_address || '',
          clsu_cluster: profileData.clsu_cluster || '',
          clsu_zipcode: profileData.clsu_zipcode || '',
          clsu_country: profileData.clsu_country || '',
          
          // Family Background
          father_fname: profileData.father_fname || '',
          father_mname: profileData.father_mname || '',
          father_lname: profileData.father_lname || '',
          father_contact: profileData.father_contact || '',
          father_education: profileData.father_education || '',
          father_occupation: profileData.father_occupation || '',
          mother_fname: profileData.mother_fname || '',
          mother_mname: profileData.mother_mname || '',
          mother_lname: profileData.mother_lname || '',
          mother_contact: profileData.mother_contact || '',
          mother_education: profileData.mother_education || '',
          mother_occupation: profileData.mother_occupation || '',
          guardian_name: profileData.guardian_name || '',
          guardian_contact: profileData.guardian_contact || '',
          emergency_person: profileData.emergency_person || '',
          
          // Academic Background
          elementary_school: profileData.elementary_school_address || '',
          elementary_year: profileData.elementary_year || '',
          elementary_address: profileData.e_address || '',
          high_school: profileData.high_school_address || '',
          high_school_year: profileData.high_school_year || '',
          high_school_address: profileData.h_address || '',
          senior_high_school: profileData.senior_high_address || '',
          senior_high_year: profileData.senior_high_year || '',
          senior_high_address: profileData.sh_address || '',
          
          // PWD/Handicap
          disability: profileData.disability === 1 || profileData.disability === '1' || profileData.disability === 'Yes' ? 'Yes' : 'No',
          disability_type: profileData.disability_type || '',
          disability_proof: profileData.disability_proof || '',
          
          // Minority Group
          indigenous: profileData.indigenous === 1 || profileData.indigenous === '1' || profileData.indigenous === 'Yes' ? 'Yes' : 'No',
          indigenous_type: profileData.indigenous_type || '',
          indigenous_proof: profileData.indigenous_proof || '',
          
          // Family Income
          family_income: profileData.family_income || '',
          itr: profileData.itr || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        // Profile doesn't exist yet, use defaults
        console.log('No profile found, using defaults');
      } else {
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not logged in. Please login again.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare data for API
      const profileData = {
        user_id: parseInt(userId),
        // Basic Information
        firstname: formData.firstname,
        middlename: formData.middlename,
        lastname: formData.lastname,
        suffix: formData.suffix,
        student_mobile_contact: formData.student_mobile_contact,
        student_email: formData.student_email,
        course_program: formData.course,
        
        // Personal Details
        civil_status: formData.civil_status,
        date_of_birth: formData.date_of_birth,
        place_of_birth: formData.place_of_birth,
        nationality: formData.nationality,
        sex: formData.sex,
        gender: formData.gender,
        religion_id: formData.religion_id ? parseInt(formData.religion_id) : null,
        birth_order: formData.birth_order,
        sibling_in_college: formData.sibling_in_college,
        sibling_college_graduate: formData.sibling_college_graduate,
        
        // Address Information
        permanent_address: formData.permanent_address,
        permanent_cluster: formData.permanent_region,
        zipcode: formData.zipcode,
        country: formData.country,
        clsu_address: formData.clsu_address,
        clsu_cluster: formData.clsu_region,
        clsu_zipcode: formData.clsu_zipcode,
        clsu_country: formData.clsu_country,
        
        // Family Background
        father_fname: formData.father_fname,
        father_mname: formData.father_mname,
        father_lname: formData.father_lname,
        father_contact: formData.father_contact,
        father_education: formData.father_education,
        father_occupation: formData.father_occupation,
        mother_fname: formData.mother_fname,
        mother_mname: formData.mother_mname,
        mother_lname: formData.mother_lname,
        mother_contact: formData.mother_contact,
        mother_education: formData.mother_education,
        mother_occupation: formData.mother_occupation,
        guardian_name: formData.guardian_name,
        guardian_contact: formData.guardian_contact,
        emergency_person: formData.emergency_person,
        
        // Academic Background
        elementary_school_address: formData.elementary_school,
        elementary_year: formData.elementary_year,
        e_address: formData.elementary_address,
        high_school_address: formData.high_school,
        high_school_year: formData.high_school_year,
        h_address: formData.high_school_address,
        senior_high_address: formData.senior_high_school,
        senior_high_year: formData.senior_high_year,
        sh_address: formData.senior_high_address,
        
        // PWD/Handicap
        disability: formData.disability === 'Yes' ? 1 : 0,
        disability_type: formData.disability_type,
        disability_proof: formData.disability_proof,
        
        // Minority Group
        indigenous: formData.indigenous === 'Yes' ? 1 : 0,
        indigenous_type: formData.indigenous_type,
        indigenous_proof: formData.indigenous_proof,
        
        // Family Income
        family_income: formData.family_income,
        itr: formData.itr,
      };
      
      const response = await axios.put(`${API_URL}/applicant-profile/user/${userId}`, profileData);
      
      if (response.data.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.response?.status === 404) {
        // Profile doesn't exist, try to create it
        try {
          const createResponse = await axios.post(`${API_URL}/applicant-profile`, {
            ...profileData,
            user_id: parseInt(userId),
          });
          
          if (createResponse.data.success) {
            Alert.alert('Success', 'Profile created successfully!', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        } catch (createError) {
          console.error('Error creating profile:', createError);
          Alert.alert('Error', 'Failed to save profile. Please try again.');
        }
      } else if (error.response?.data?.errors) {
        // Validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        Alert.alert('Validation Error', errorMessages);
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle same as permanent address
  const toggleSameAsPermanent = () => {
    const newValue = !formData.same_as_permanent;
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        same_as_permanent: true,
        clsu_address: prev.permanent_address,
        clsu_region: prev.permanent_region,
        clsu_province: prev.permanent_province,
        clsu_city: prev.permanent_city,
        clsu_zipcode: prev.zipcode,
        clsu_country: prev.country,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        same_as_permanent: false,
      }));
    }
  };

  // Reusable Input Component
  const FormInput = ({ label, field, placeholder, keyboardType = 'default', multiline = false, readonly = false, required = false }) => (
    <View className="mb-4">
      <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
        {label}{required && <Text className="text-red-500"> *</Text>}
        {readonly && <Text className="text-gray-400"> (readonly)</Text>}
      </Text>
      <View 
        className={`rounded-xl border-2 bg-gray-50 px-4 ${
          focusedField === field ? 'border-[#008000]' : 'border-gray-200'
        } ${readonly ? 'bg-gray-100' : ''}`}
      >
        <TextInput
          className={`py-3.5 font-montserrat text-sm ${readonly ? 'text-gray-500' : 'text-black'} ${multiline ? 'min-h-[60px]' : ''}`}
          value={formData[field]}
          onChangeText={(value) => updateFormData(field, value)}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType={keyboardType}
          autoCapitalize="none"
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField('')}
          editable={!readonly}
        />
      </View>
    </View>
  );

  // Small Input for inline fields
  const SmallInput = ({ label, field, placeholder, flex = 1, keyboardType = 'default' }) => (
    <View style={{ flex }} className="mr-2">
      <TextInput
        className={`rounded-xl border-2 bg-gray-50 px-4 py-3 font-montserrat text-sm text-black ${
          focusedField === field ? 'border-[#008000]' : 'border-gray-200'
        }`}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField('')}
      />
      <Text className="mt-1 font-montserrat text-xs text-[#008000]">{label}</Text>
    </View>
  );

  // Radio Button Component
  const RadioButton = ({ label, field, value, required = false }) => (
    <View className="mb-4">
      <Text className="mb-3 font-montserrat-medium text-sm text-gray-700">
        {label}{required && <Text className="text-red-500"> *</Text>}
      </Text>
      <View className="flex-row">
        <TouchableOpacity 
          className="mr-6 flex-row items-center"
          onPress={() => updateFormData(field, 'Yes')}
        >
          <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${
            formData[field] === 'Yes' ? 'border-[#008000]' : 'border-gray-400'
          }`}>
            {formData[field] === 'Yes' && <View className="h-3 w-3 rounded-full bg-[#008000]" />}
          </View>
          <Text className="ml-2 font-montserrat text-sm text-gray-700">Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => updateFormData(field, 'No')}
        >
          <View className={`h-5 w-5 rounded-full border-2 items-center justify-center ${
            formData[field] === 'No' ? 'border-[#008000]' : 'border-gray-400'
          }`}>
            {formData[field] === 'No' && <View className="h-3 w-3 rounded-full bg-[#008000]" />}
          </View>
          <Text className="ml-2 font-montserrat text-sm text-gray-700">No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Dropdown Component (simplified as TextInput for now)
  const DropdownInput = ({ label, field, placeholder, options = [], required = false }) => (
    <View className="mb-4">
      <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
        {label}{required && <Text className="text-red-500"> *</Text>}
      </Text>
      <View 
        className={`flex-row items-center rounded-xl border-2 bg-gray-50 px-4 ${
          focusedField === field ? 'border-[#008000]' : 'border-gray-200'
        }`}
      >
        <TextInput
          className="flex-1 py-3.5 font-montserrat text-sm text-black"
          value={formData[field]}
          onChangeText={(value) => updateFormData(field, value)}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField('')}
        />
        <Ionicons name="chevron-down" size={20} color="#9ca3af" />
      </View>
    </View>
  );

  // Section Header Component
  const SectionHeader = ({ title }) => (
    <View className="mb-4 rounded-xl bg-[#008000]/10 px-4 py-3 flex-row items-center justify-between">
      <Text className="font-montserrat-semibold text-base text-[#1a365d]">{title}</Text>
      <Ionicons name="heart" size={20} color="#008000" />
    </View>
  );

  // File Upload Component
  const FileUpload = ({ label, field, helperText }) => (
    <View className="mb-4">
      <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">{label}</Text>
      <TouchableOpacity 
        className="flex-row items-center"
        onPress={() => Alert.alert('File Upload', 'File picker would open here')}
      >
        <View className="rounded border border-gray-300 bg-gray-100 px-3 py-2">
          <Text className="font-montserrat text-xs text-gray-600">Choose File</Text>
        </View>
        <Text className="ml-2 font-montserrat text-sm text-gray-500">
          {formData[field] || 'No file chosen'}
        </Text>
      </TouchableOpacity>
      {helperText && (
        <Text className="mt-1 font-montserrat text-xs text-[#008000]">{helperText}</Text>
      )}
    </View>
  );

  // Step 1: Basic Information
  const renderStep1 = () => (
    <View>
      <SectionHeader title="Basic Information" />
      
      <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">Full Name</Text>
      <View className="mb-2 flex-row">
        <SmallInput label="First Name" field="firstname" placeholder="First Name" />
        <SmallInput label="Middle Name" field="middlename" placeholder="Middle Name" />
      </View>
      <View className="mb-4 flex-row">
        <SmallInput label="Last Name" field="lastname" placeholder="Last Name" />
        <SmallInput label="Suffix" field="suffix" placeholder="Suffix" flex={0.5} />
      </View>
      
      <View className="flex-row">
        <View className="flex-1 mr-2">
          <FormInput 
            label="Student Number" 
            field="student_number" 
            placeholder="Student Number"
            readonly={true}
          />
        </View>
        <View className="flex-1 ml-2">
          <FormInput 
            label="Course" 
            field="course" 
            placeholder="Course"
            readonly={true}
          />
        </View>
      </View>
      
      <View className="flex-row">
        <View className="flex-1 mr-2">
          <FormInput 
            label="Contact Number" 
            field="student_mobile_contact" 
            placeholder="#09XXXXXXXXX"
            keyboardType="phone-pad"
            required={true}
          />
        </View>
        <View className="flex-1 ml-2">
          <FormInput 
            label="Personal Email" 
            field="student_email" 
            placeholder="email@example.com"
            keyboardType="email-address"
            required={true}
          />
        </View>
      </View>
    </View>
  );

  // Step 2: Personal Details
  const renderStep2 = () => (
    <View>
      <SectionHeader title="Basic Information" />
      
      <DropdownInput label="Civil Status" field="civil_status" placeholder="Single" required={true} />
      
      <FormInput label="Birthdate" field="date_of_birth" placeholder="DD/MM/YYYY" required={true} />
      
      <FormInput label="Birth Place" field="place_of_birth" placeholder="Enter birth place" required={true} />
      
      <FormInput label="Nationality" field="nationality" placeholder="Filipino" required={true} />
      
      <DropdownInput label="Sex" field="sex" placeholder="Male" required={true} />
      
      <DropdownInput label="Gender" field="gender" placeholder="Select gender" />
      
      <DropdownInput label="Religion" field="religion_id" placeholder="Roman Catholic" required={true} />
      
      <FormInput label="Birth Order (e.g 1st, 2nd, 3rd)" field="birth_order" placeholder="1st" required={true} />
      
      <DropdownInput 
        label="Is any of your sibling is currently enrolled in college?" 
        field="sibling_in_college" 
        placeholder="No"
        required={true}
      />
      
      <DropdownInput 
        label="Is any of your sibling is college graduate?" 
        field="sibling_college_graduate" 
        placeholder="No"
        required={true}
      />
    </View>
  );

  // Step 3: Address Information
  const renderStep3 = () => (
    <View>
      <SectionHeader title="Basic Information" />
      
      <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
        Permanent Address<Text className="text-red-500"> *</Text>
      </Text>
      
      <FormInput label="" field="permanent_address" placeholder="House no./Street/Brgy" />
      <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">House no./Street/Brgy</Text>
      
      <DropdownInput label="" field="permanent_region" placeholder="Region III" />
      <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Region</Text>
      
      <View className="flex-row">
        <View className="flex-1 mr-2">
          <DropdownInput label="" field="permanent_province" placeholder="Nueva Ecija" />
          <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Province</Text>
        </View>
        <View className="flex-1 ml-2">
          <DropdownInput label="" field="permanent_city" placeholder="Science City of Muñoz" />
          <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">City</Text>
        </View>
      </View>
      
      <View className="flex-row">
        <View className="flex-1 mr-2">
          <FormInput label="" field="zipcode" placeholder="3119" keyboardType="numeric" />
          <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Postal / Zip Code</Text>
        </View>
        <View className="flex-1 ml-2">
          <FormInput label="" field="country" placeholder="Philippines" />
          <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Country</Text>
        </View>
      </View>
      
      <View className="my-2 h-[1px] bg-gray-200" />
      
      <View className="flex-row items-center mb-4">
        <Text className="font-montserrat-medium text-sm text-gray-700">
          Address while in CLSU<Text className="text-red-500"> *</Text>
        </Text>
      </View>
      
      <TouchableOpacity 
        className="flex-row items-center mb-4"
        onPress={toggleSameAsPermanent}
      >
        <View className={`h-5 w-5 rounded border-2 items-center justify-center mr-2 ${
          formData.same_as_permanent ? 'border-[#008000] bg-[#008000]' : 'border-gray-400'
        }`}>
          {formData.same_as_permanent && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
        <Text className="font-montserrat text-xs text-[#008000] underline">same as permanent address</Text>
      </TouchableOpacity>
      
      <FormInput label="" field="clsu_address" placeholder="House no./Street/Brgy" />
      <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">House no./Street/Brgy</Text>
      
      <DropdownInput label="" field="clsu_region" placeholder="Region III" />
      <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Region</Text>
      
      <View className="flex-row">
        <View className="flex-1 mr-2">
          <DropdownInput label="" field="clsu_province" placeholder="Nueva Ecija" />
          <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Province</Text>
        </View>
        <View className="flex-1 ml-2">
          <DropdownInput label="" field="clsu_city" placeholder="Science City of Muñoz" />
          <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">City</Text>
        </View>
      </View>
      
      <View className="flex-row">
        <View className="flex-1 mr-2">
          <FormInput label="" field="clsu_zipcode" placeholder="3119" keyboardType="numeric" />
          <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Postal / Zip Code</Text>
        </View>
        <View className="flex-1 ml-2">
          <FormInput label="" field="clsu_country" placeholder="Philippines" />
          <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Country</Text>
        </View>
      </View>
    </View>
  );

  // Step 4: Family Background
  const renderStep4 = () => (
    <View>
      <SectionHeader title="Basic Information" />
      
      <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
        Name of Father (lastname, firstname mi)<Text className="text-red-500"> *</Text>
      </Text>
      <View className="flex-row mb-2">
        <View className="flex-1 mr-2">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-4 py-3 font-montserrat text-sm text-black ${
              focusedField === 'father_fname' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.father_fname}
            onChangeText={(value) => updateFormData('father_fname', value)}
            placeholder="First Name"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('father_fname')}
            onBlur={() => setFocusedField('')}
          />
        </View>
        <View className="flex-1 ml-2">
          <FormInput label="Contact Number" field="father_contact" placeholder="N/A" />
        </View>
      </View>
      <View className="flex-row mb-2">
        <View className="flex-1 mr-2">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-4 py-3 font-montserrat text-sm text-black ${
              focusedField === 'father_mname' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.father_mname}
            onChangeText={(value) => updateFormData('father_mname', value)}
            placeholder="Middle Initial"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('father_mname')}
            onBlur={() => setFocusedField('')}
          />
        </View>
        <View className="flex-1 ml-2" />
      </View>
      <View className="flex-row mb-4">
        <View className="flex-1 mr-2">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-4 py-3 font-montserrat text-sm text-black ${
              focusedField === 'father_lname' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.father_lname}
            onChangeText={(value) => updateFormData('father_lname', value)}
            placeholder="Last Name"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('father_lname')}
            onBlur={() => setFocusedField('')}
          />
        </View>
        <View className="flex-1 ml-2" />
      </View>
      
      <DropdownInput label="Educational Attainment" field="father_education" placeholder="Not College Graduate" required={true} />
      
      <FormInput label="Occupation" field="father_occupation" placeholder="N/A" required={true} />
      
      <View className="my-2 h-[1px] bg-gray-200" />
      
      <Text className="mb-2 font-montserrat-medium text-sm text-gray-700">
        Name of Mother (Firstname, M.I, Lastname)<Text className="text-red-500"> *</Text>
      </Text>
      <View className="flex-row mb-2">
        <View className="flex-1 mr-2">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-4 py-3 font-montserrat text-sm text-black ${
              focusedField === 'mother_fname' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.mother_fname}
            onChangeText={(value) => updateFormData('mother_fname', value)}
            placeholder="First Name"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('mother_fname')}
            onBlur={() => setFocusedField('')}
          />
        </View>
        <View className="flex-1 ml-2">
          <FormInput label="Contact Number" field="mother_contact" placeholder="09XXXXXXXXX" />
        </View>
      </View>
      <View className="flex-row mb-2">
        <View className="flex-1 mr-2">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-4 py-3 font-montserrat text-sm text-black ${
              focusedField === 'mother_mname' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.mother_mname}
            onChangeText={(value) => updateFormData('mother_mname', value)}
            placeholder="Middle Initial"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('mother_mname')}
            onBlur={() => setFocusedField('')}
          />
        </View>
        <View className="flex-1 ml-2" />
      </View>
      <View className="flex-row mb-4">
        <View className="flex-1 mr-2">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-4 py-3 font-montserrat text-sm text-black ${
              focusedField === 'mother_lname' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.mother_lname}
            onChangeText={(value) => updateFormData('mother_lname', value)}
            placeholder="Last Name"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('mother_lname')}
            onBlur={() => setFocusedField('')}
          />
        </View>
        <View className="flex-1 ml-2" />
      </View>
      
      <DropdownInput label="Educational Attainment" field="mother_education" placeholder="Not College Graduate" required={true} />
      
      <FormInput label="Occupation" field="mother_occupation" placeholder="N/A" required={true} />
      
      <View className="my-2 h-[1px] bg-gray-200" />
      
      <View className="flex-row">
        <View className="flex-1 mr-2">
          <FormInput 
            label="Name of Guardian (lastname, firstname mi)" 
            field="guardian_name" 
            placeholder="Del Rosario, Carolyn M."
            required={true}
          />
        </View>
        <View className="flex-1 ml-2">
          <FormInput 
            label="Contact Number" 
            field="guardian_contact" 
            placeholder="09XXXXXXXXX"
            keyboardType="phone-pad"
            required={true}
          />
        </View>
      </View>
      
      <FormInput 
        label="In case of emergency whom to notify" 
        field="emergency_person" 
        placeholder="Carolyn M. Del Rosario"
        required={true}
      />
    </View>
  );

  // Step 5: Academic Background
  const renderStep5 = () => (
    <View>
      <SectionHeader title="Academic Background" />
      
      <Text className="mb-3 font-montserrat-medium text-sm text-gray-700">
        Elementary School<Text className="text-red-500"> *</Text>
      </Text>
      <View className="flex-row mb-4">
        <View className="flex-1 mr-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'elementary_school' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.elementary_school}
            onChangeText={(value) => updateFormData('elementary_school', value)}
            placeholder="School Name"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('elementary_school')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Name of School</Text>
        </View>
        <View className="flex-1 mx-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'elementary_year' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.elementary_year}
            onChangeText={(value) => updateFormData('elementary_year', value)}
            placeholder="2015-2016"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('elementary_year')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Year Graduated</Text>
        </View>
        <View className="flex-1 ml-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'elementary_address' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.elementary_address}
            onChangeText={(value) => updateFormData('elementary_address', value)}
            placeholder="Address"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('elementary_address')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Address</Text>
        </View>
      </View>
      
      <Text className="mb-3 font-montserrat-medium text-sm text-gray-700">
        High School<Text className="text-red-500"> *</Text>
      </Text>
      <View className="flex-row mb-4">
        <View className="flex-1 mr-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'high_school' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.high_school}
            onChangeText={(value) => updateFormData('high_school', value)}
            placeholder="School Name"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('high_school')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Name of School</Text>
        </View>
        <View className="flex-1 mx-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'high_school_year' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.high_school_year}
            onChangeText={(value) => updateFormData('high_school_year', value)}
            placeholder="2019-2020"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('high_school_year')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Year Graduated</Text>
        </View>
        <View className="flex-1 ml-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'high_school_address' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.high_school_address}
            onChangeText={(value) => updateFormData('high_school_address', value)}
            placeholder="Address"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('high_school_address')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Address</Text>
        </View>
      </View>
      
      <Text className="mb-3 font-montserrat-medium text-sm text-gray-700">
        Senior High School
      </Text>
      <View className="flex-row mb-4">
        <View className="flex-1 mr-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'senior_high_school' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.senior_high_school}
            onChangeText={(value) => updateFormData('senior_high_school', value)}
            placeholder="School Name"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('senior_high_school')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Name of School</Text>
        </View>
        <View className="flex-1 mx-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'senior_high_year' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.senior_high_year}
            onChangeText={(value) => updateFormData('senior_high_year', value)}
            placeholder="2021-2022"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('senior_high_year')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Year Graduated</Text>
        </View>
        <View className="flex-1 ml-1">
          <TextInput
            className={`rounded-xl border-2 bg-gray-50 px-3 py-3 font-montserrat text-sm text-black ${
              focusedField === 'senior_high_address' ? 'border-[#008000]' : 'border-gray-200'
            }`}
            value={formData.senior_high_address}
            onChangeText={(value) => updateFormData('senior_high_address', value)}
            placeholder="Address"
            placeholderTextColor="#9ca3af"
            onFocus={() => setFocusedField('senior_high_address')}
            onBlur={() => setFocusedField('')}
          />
          <Text className="mt-1 font-montserrat text-xs text-[#008000]">Address</Text>
        </View>
      </View>
    </View>
  );

  // Step 6: PWD/Handicap
  const renderStep6 = () => (
    <View>
      <SectionHeader title="Other Details" />
      
      <RadioButton label="PWD/Handicap" field="disability" required={true} />
      
      <FormInput 
        label="(if Yes) Give Particular:" 
        field="disability_type" 
        placeholder="PWD/Handicap"
      />
      <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">PWD/Handicap</Text>
      
      <FileUpload 
        label="ID/Medical Certificate" 
        field="disability_proof"
        helperText="Proof of PWD/Handicap"
      />
    </View>
  );

  // Step 7: Minority Group
  const renderStep7 = () => (
    <View>
      <SectionHeader title="Other Details" />
      
      <RadioButton label="Member of minority group" field="indigenous" required={true} />
      
      <FormInput 
        label="(if Yes) Give Particular minority group:" 
        field="indigenous_type" 
        placeholder="Member of minority group"
      />
      <Text className="-mt-3 mb-3 font-montserrat text-xs text-[#008000]">Member of minority group</Text>
      
      <FileUpload 
        label="ID/Proof" 
        field="indigenous_proof"
        helperText="Proof of membership in minority group"
      />
    </View>
  );

  // Step 8: Family Income
  const renderStep8 = () => (
    <View>
      <SectionHeader title="Other Details" />
      
      <View className="mb-4 rounded-lg bg-yellow-50 p-3 border border-yellow-200">
        <Text className="font-montserrat text-xs text-gray-600 italic">
          Note: The information on family income and supporting documents maybe used in applying for scholarship grants to be administered by the university
        </Text>
      </View>
      
      <DropdownInput 
        label="Annual Family Income" 
        field="family_income" 
        placeholder="Please Select"
        required={true}
      />
      
      <FileUpload 
        label="Certificate of Indigency/Proof of No Income/ITR" 
        field="itr"
        helperText="Any"
      />
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      default: return renderStep1();
    }
  };

  // Progress Bar Component
  const ProgressBar = () => (
    <View className="mb-6">
      <View className="flex-row justify-between mb-2">
        {steps.map((step) => (
          <View 
            key={step.id} 
            className={`h-2 flex-1 rounded-full mx-0.5 ${
              step.id <= currentStep ? 'bg-[#008000]' : 'bg-gray-200'
            }`} 
          />
        ))}
      </View>
      <Text className="text-center font-montserrat text-sm text-gray-600">
        Step {currentStep} of {totalSteps}: {steps[currentStep - 1].title}
      </Text>
    </View>
  );

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
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#008000" />
            <Text className="mt-4 font-montserrat-medium text-gray-600">Loading profile...</Text>
          </View>
        ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="flex-row items-center mb-2"
            style={{ marginTop: isLandscape ? 8 : 16 }}
          >
            <Ionicons name="arrow-back" size={24} color="#008000" />
            <Text className="ml-2 font-montserrat-medium text-[#008000]">Back</Text>
          </TouchableOpacity>

          <ScrollView 
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false} 
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              maxWidth: contentMaxWidth,
              alignSelf: 'center',
              width: '100%',
              paddingBottom: 40
            }}
          >
            {/* Header */}
            <View className="mb-4">
              <Text className="font-montserrat-bold text-xl text-[#1a365d] text-center uppercase tracking-wider">
                Update Student Information
              </Text>
            </View>

            {/* Progress Bar */}
            <ProgressBar />

            {/* Current Step Content */}
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <View className="mt-6 flex-row justify-end">
              {/* Previous Button */}
              {currentStep > 1 && (
                <TouchableOpacity
                  className="mr-2 px-6 py-3 rounded-lg bg-gray-500"
                  onPress={handlePrevious}
                  activeOpacity={0.8}
                  disabled={submitting}
                >
                  <Text className="font-montserrat-semibold text-sm text-white">
                    Previous
                  </Text>
                </TouchableOpacity>
              )}

              {/* Next / Submit Button */}
              {currentStep < totalSteps ? (
                <TouchableOpacity
                  className="px-6 py-3 rounded-lg bg-[#008000]"
                  onPress={handleNext}
                  activeOpacity={0.8}
                >
                  <Text className="font-montserrat-semibold text-sm text-white">
                    Next
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className={`px-6 py-3 rounded-lg ${submitting ? 'bg-[#008000]/70' : 'bg-[#008000]'}`}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                  disabled={submitting}
                >
                  {submitting ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="ml-2 font-montserrat-semibold text-sm text-white">
                        Saving...
                      </Text>
                    </View>
                  ) : (
                    <Text className="font-montserrat-semibold text-sm text-white">
                      Submit
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>

            {/* Bottom Spacing */}
            <View className="h-10" />
          </ScrollView>
        </KeyboardAvoidingView>
        )}
      </View>
    </LinearGradient>
  );
};

export default EditProfile;