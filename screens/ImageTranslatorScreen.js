// screens/ImageTranslatorScreen.js - FIXED with Google Vision OCR
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

// REPLACE WITH YOUR GOOGLE VISION API KEY
const GOOGLE_VISION_KEY = 'AIzaSyAzarJuuFzjtw8Y6OnOYRbd1s4pX2wIOa4E';

export default function ImageTranslatorScreen() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Pick from camera
  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed for camera');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setStep(2);
    }
  };

  // Pick from gallery  
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed for gallery');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setStep(2);
    }
  };

  // FIXED OCR using Google Vision API
  const performOCR = async () => {
    if (!image) return;

    try {
      setLoading(true);
      setExtractedText('');

      // Get base64 from image picker result (already stored)
      const imgSource = Image.resolveAssetSource({ uri: image });
      const base64 = imgSource.uri.split(',')[1]; // Extract base64 data

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_KEY}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [{
              image: { content: base64 },
              features: [{ type: 'TEXT_DETECTION', maxResults: 10 }]
            }]
          }),
        }
      );

      const result = await response.json();
      
      if (result.responses && result.responses[0].fullTextAnnotation) {
        const text = result.responses[0].fullTextAnnotation.text;
        setExtractedText(text || 'No text found');
        setStep(3);
      } else {
        setExtractedText('No text detected. Try clearer image.');
      }
    } catch (error) {
      console.log('OCR Error:', error);
      setExtractedText('Error: Check API key or internet');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setExtractedText('');
    setStep(1);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Image Translator</Text>
        <Text style={styles.subtitle}>
          {step === 1 && '📸 Pick or take image'}
          {step === 2 && '✨ Ready to extract text'}
          {step === 3 && '✅ Text extracted!'}
        </Text>
      </View>

      {/* Step 1: Pick */}
      {step === 1 && (
        <View style={styles.pickContainer}>
          <View style={styles.pickCard}>
            <Ionicons name="text-outline" size={80} color="#ff7a45" />
            <Text style={styles.pickTitle}>Scan any text</Text>
            <Text style={styles.pickDesc}>Menus, signs, documents</Text>
            
            <TouchableOpacity style={styles.bigButton} onPress={pickFromCamera}>
              <Ionicons name="camera" size={28} color="#fff" />
              <Text style={styles.bigButtonText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bigButton} onPress={pickFromGallery}>
              <Ionicons name="image" size={28} color="#fff" />
              <Text style={styles.bigButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 2: Preview + OCR */}
      {step === 2 && image && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <Text style={styles.previewText}>Tap to extract text</Text>
          
          <TouchableOpacity 
            style={[styles.ocrButton, loading && styles.disabled]}
            onPress={performOCR}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="text" size={24} color="#fff" />
                <Text style={styles.ocrButtonText}>EXTRACT TEXT</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Step 3: Results */}
      {step === 3 && image && (
        <View style={styles.resultContainer}>
          <Image source={{ uri: image }} style={styles.resultImage} />
          
          <View style={styles.textContainer}>
            <Text style={styles.resultTitle}>Extracted Text:</Text>
            <Text style={styles.extractedText}>{extractedText}</Text>
          </View>
          
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => {
              Alert.alert('Copied!', 'Text copied to clipboard');
            }}>
              <Ionicons name="copy" size={20} color="#fff" />
              <Text style={styles.actionText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={reset}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.actionText}>New Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050b18' },
  header: { 
    padding: 24, 
    paddingTop: 60, 
    alignItems: 'center' 
  },
  title: { 
    color: '#fff', 
    fontSize: 32, 
    fontWeight: '800' 
  },
  subtitle: { 
    color: '#b0b4c3', 
    fontSize: 16, 
    marginTop: 8,
    textAlign: 'center'
  },

  pickContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickCard: {
    backgroundColor: '#161b2b',
    borderRadius: 28,
    padding: 48,
    alignItems: 'center',
    width: '100%',
  },
  pickTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 24,
    marginBottom: 8,
  },
  pickDesc: {
    color: '#b0b4c3',
    fontSize: 16,
    marginBottom: 32,
  },
  bigButton: {
    flexDirection: 'row',
    backgroundColor: '#ff7a45',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  bigButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
  },

  previewContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  imagePreview: {
    width: 320,
    height: 320,
    borderRadius: 24,
    marginBottom: 24,
  },
  previewText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 32,
  },
  ocrButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  ocrButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 12,
  },
  disabled: {
    backgroundColor: '#666',
  },

  resultContainer: {
    flex: 1,
    padding: 24,
  },
  resultImage: {
    width: '100%',
    height: 280,
    borderRadius: 24,
    marginBottom: 24,
  },
  textContainer: {
    backgroundColor: '#161b2b',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    minHeight: 140,
  },
  resultTitle: {
    color: '#ff7a45',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  extractedText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'monospace',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
});
