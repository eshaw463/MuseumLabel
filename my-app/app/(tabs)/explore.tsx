import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from '@google/genai';
import React, { useEffect, useState } from 'react';

const apiKey1 = 'GOOGLE API KEY GOES HERE'; //GOOGLE API KEY GOES HERE
const ai = new GoogleGenAI({ apiKey: apiKey1 });

type RootStackParamList = {
  Home: undefined;
  explore: { imageUri: string };
};

type ExploreRouteProp = RouteProp<RootStackParamList, 'explore'>;

export default function TabTwoScreen() {
  const route = useRoute<ExploreRouteProp>();
  const { imageUri } = route.params || {};

  const [label, setLabel] = useState('Generating museum label...');

  useEffect(() => {
    const generateLabel = async () => {
      if (!imageUri) return;

     try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const contents = [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64,
              },
            },
            {
              text: "Write a museum label for this artwork, including artist, title of the artwork, range of years, artistic style or movement, and an interesting fact about the piece if applicable.",
            },
          ],
        },
      ];

      const result = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents,
      });


const label = await result.text; // text() or text

if (label){
setLabel(label);
}
      } catch (error) {
        console.error("AI error:", error);
        setLabel('Failed to generate label.');
      }
    };

    generateLabel();
  }, [imageUri]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.headerBanner}
            contentFit="cover"
          />
        ) : (
          <IconSymbol
            size={310}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        )
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Analysis</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText>{label}</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  headerBanner: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
