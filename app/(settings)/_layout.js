import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
        contentStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen 
        name="editprofile" 
        options={{
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen 
        name="changepassword" 
        options={{
          title: 'Change Password',
        }}
      />
    </Stack>
  );
}