import { useEffect, useState } from 'react';
import { Button, Alert, StyleSheet, Image as RNImage } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Image } from 'expo-image';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
   type RootStackParamList = {
    Home: undefined;
    explore: { imageUri: string }; // define expected params
  };

  type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera access is required to take photos.');
      }
    })();
  }, []);

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while trying to take a photo.');
    }
  };

  const analyzePhoto = () => {

    if (imageUri) {
      navigation.navigate('explore', {imageUri});
    } else {
      Alert.alert('No photo', 'Please take a photo before analyzing.');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Museum Label</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">How to use:</ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">
            Click the button below and take a photo of the artwork you would like to learn about. {'\n'}
          </ThemedText>
          <ThemedText> </ThemedText>
          <ThemedText type="defaultSemiBold">
          {'\n'}*Warning* this app uses AI to analyze the photo, and results are often inaccurate :(
          </ThemedText>

          
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <Button title="Take a Photo" onPress={takePhoto} />
        <ThemedText> </ThemedText>
        <Button title="Analyze Photo" onPress={analyzePhoto} />
      </ThemedView>
      {imageUri && (
        <ThemedView style={styles.previewContainer}>
          <ThemedText type="subtitle">Photo Taken:</ThemedText>
          <RNImage source={{ uri: imageUri }} style={styles.previewImage} />
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  reactLogo: {
    width: '100%',
  height: '110%',
  position: 'absolute',
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginTop: 10,
  },
});