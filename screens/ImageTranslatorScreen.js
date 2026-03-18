// screens/ImageTranslatorScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAKE_LANGUAGES = {
  'English': { code: 'en', native: 'English' },
  'Hindi': { code: 'hi', native: 'हिंदी' },
  'French': { code: 'fr', native: 'Français' },
  'Spanish': { code: 'es', native: 'Español' },
  'German': { code: 'de', native: 'Deutsch' },
};

// Fake translations (replace with real Google Translate API later)
const FAKE_TRANSLATIONS = {
  'Bonjour le monde': { en: 'Hello world', hi: 'नमस्ते दुनिया', es: 'Hola mundo' },
  '¡Hola amigos!': { en: 'Hello friends!', hi: 'नमस्ते दोस्तों!', es: '¡Hola amigos!' },
  'Guten Tag': { en: 'Good day', hi: 'नमस्कार', de: 'Guten Tag' },
  'नमस्ते भारत': { en: 'Hello India', hi: 'नमस्ते भारत' },
};

function LanguagePicker({ 
  selectedLang, 
  onLangChange, 
  label 
}) {
  return (
    <View style={styles.langPicker}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <View style={styles.langRow}>
        {Object.entries(FAKE_LANGUAGES).map(([name, data]) => (
          <TouchableOpacity
            key={name}
            style={[
              styles.langButton,
              selectedLang === name && styles.langButtonActive,
            ]}
            onPress={() => onLangChange(name)}
          >
            <Text
              style={[
                styles.langText,
                selectedLang === name && styles.langTextActive,
              ]}
            >
              {data.native}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function ImageTranslatorScreen() {
  const [step, setStep] = useState('camera'); // camera, processing, result
  const [detectedText, setDetectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('French');
  const [toLang, setToLang] = useState('Hindi');
  const [showImage, setShowImage] = useState(false);

  const handleCapture = () => {
    // Simulate camera capture
    setTimeout(() => {
      setDetectedText('Bonjour le monde');
      setStep('processing');
      setShowImage(true);
    }, 800);
  };

  const handleProcess = () => {
    // Simulate OCR + translation
    setTimeout(() => {
      const translation = FAKE_TRANSLATIONS['Bonjour le monde']?.[toLang] || 
                         FAKE_TRANSLATIONS['Bonjour le monde'].en;
      setTranslatedText(translation);
      setStep('result');
    }, 1500);
  };

  const handleRetake = () => {
    setStep('camera');
    setDetectedText('');
    setTranslatedText('');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Image Translator</Text>
        <Text style={styles.subtitle}>
          Capture text from photos and translate instantly
        </Text>
      </View>

      {/* Step 1: Camera */}
      {step === 'camera' && (
        <View style={styles.cameraStep}>
          <View style={styles.cameraPreview}>
            <Ionicons name="camera-outline" size={80} color="#666" />
            <Text style={styles.cameraText}>Tap to capture image</Text>
          </View>
          
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <Ionicons name="radio-button-on" size={60} color="#ff7a45" />
            <Text style={styles.captureLabel}>Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton}>
            <Ionicons name="image-outline" size={24} color="#ffffff" />
            <Text style={styles.galleryText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2: Processing */}
      {step === 'processing' && (
        <View style={styles.processingStep}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300' }}
            style={styles.capturedImage}
          />
          
          <View style={styles.processingIndicator}>
            <Ionicons name="hourglass" size={32} color="#ff7a45" />
            <Text style={styles.processingText}>Detecting text...</Text>
            <Text style={styles.detectedText}>{detectedText}</Text>
          </View>

          <TouchableOpacity style={styles.nextButton} onPress={handleProcess}>
            <Text style={styles.nextButtonText}>Translate</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 3: Result */}
      {step === 'result' && (
        <View style={styles.resultStep}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300' }}
            style={styles.capturedImage}
          />

          <View style={styles.translationCard}>
            <Text style={styles.detectedTitle}>Detected Text</Text>
            <Text style={styles.detectedText}>{detectedText}</Text>

            <LanguagePicker
              selectedLang={toLang}
              onLangChange={setToLang}
              label="Translate to:"
            />

            <Text style={styles.translatedTitle}>Translation</Text>
            <Text style={styles.translatedText}>{translatedText}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRetake}>
              <Text style={styles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050b18',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#b0b4c3',
    fontSize: 13,
    marginTop: 6,
  },

  // Camera step
  cameraStep: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraPreview: {
    backgroundColor: '#161b2b',
    width: 280,
    height: 400,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  cameraText: {
    color: '#b0b4c3',
    fontSize: 16,
    marginTop: 12,
  },
  captureButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  captureLabel: {
    color: '#ff7a45',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2740',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  galleryText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 8,
  },

  // Processing step
  processingStep: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  capturedImage: {
    width: 300,
    height: 200,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  processingIndicator: {
    backgroundColor: '#161b2b',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  processingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  detectedText: {
    color: '#ff7a45',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Result step
  resultStep: {
    flex: 1,
    paddingHorizontal: 20,
  },
  translationCard: {
    backgroundColor: '#161b2b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  detectedTitle: {
    color: '#b0b4c3',
    fontSize: 14,
    marginBottom: 4,
  },
  detectedText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  translatedTitle: {
    color: '#b0b4c3',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 4,
  },
  translatedText: {
    color: '#ff7a45',
    fontSize: 20,
    fontWeight: '600',
  },

  langPicker: {
    marginTop: 20,
  },
  pickerLabel: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langButton: {
    backgroundColor: '#1f2740',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  langButtonActive: {
    backgroundColor: '#ff7a45',
  },
  langText: {
    color: '#d0d3e0',
    fontSize: 13,
  },
  langTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  primaryButton: {
    backgroundColor: '#ff7a45',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#1f2740',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  secondaryButtonText: {
    color: '#ffffff',
  },
  nextButton: {
    backgroundColor: '#ff7a45',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
