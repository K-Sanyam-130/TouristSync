// screens/VoiceTranslatorScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FAKE_LANGUAGES = {
  'English': { code: 'en', native: 'English' },
  'Hindi': { code: 'hi', native: 'हिंदी' },
  'French': { code: 'fr', native: 'Français' },
  'Spanish': { code: 'es', native: 'Español' },
  'German': { code: 'de', native: 'Deutsch' },
};

// Fake speech recognition results
const FAKE_SPEECH = [
  'Hello, how are you?',
  'Where is the nearest restaurant?',
  'Can you help me find the train station?',
  'What time does the museum close?',
  'नमस्ते, आप कैसे हैं?', // Hindi
  'Bonjour, où est la gare?', // French
];

function LanguagePicker({ selectedLang, onLangChange, label }) {
  return (
    <View style={styles.langPicker}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      </ScrollView>
    </View>
  );
}

function ListeningAnimation() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.micContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: pulseAnim,
        },
      ]}
    >
      <Ionicons name="mic" size={60} color="#ff7a45" />
      <View style={styles.soundWaves}>
        <View style={[styles.wave, styles.wave1]} />
        <View style={[styles.wave, styles.wave2]} />
        <View style={[styles.wave, styles.wave3]} />
      </View>
    </Animated.View>
  );
}

export default function VoiceTranslatorScreen() {
  const [status, setStatus] = useState('idle'); // idle, listening, processing, result
  const [detectedSpeech, setDetectedSpeech] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('English');
  const [toLang, setToLang] = useState('Hindi');

  const handleRecord = () => {
    setStatus('listening');
    
    // Simulate speech recognition after 2 seconds
    setTimeout(() => {
      const fakeText = FAKE_SPEECH[Math.floor(Math.random() * FAKE_SPEECH.length)];
      setDetectedSpeech(fakeText);
      setStatus('processing');
    }, 2000);
  };

  const handleProcess = () => {
    // Simulate translation after 1.5 seconds
    setTimeout(() => {
      // Fake translations based on detected speech
      const translations = {
        'Hello, how are you?': { hi: 'नमस्ते, आप कैसे हैं?', fr: 'Bonjour, comment allez-vous?' },
        'Where is the nearest restaurant?': { hi: 'निकटतम रेस्तरां कहाँ है?', fr: 'Où est le restaurant le plus proche?' },
        'Can you help me find the train station?': { hi: 'क्या आप मुझे ट्रेन स्टेशन ढूंढने में मदद कर सकते हैं?', fr: 'Pouvez-vous m\'aider à trouver la gare?' },
        'नमस्ते, आप कैसे हैं?': { en: 'Hello, how are you?', fr: 'Bonjour, comment allez-vous?' },
        'Bonjour, où est la gare?': { en: 'Hello, where is the train station?', hi: 'नमस्ते, ट्रेन स्टेशन कहाँ है?' },
      };
      
      const translation = translations[detectedSpeech]?.[toLang] || detectedSpeech;
      setTranslatedText(translation);
      setStatus('result');
    }, 1500);
  };

  const handleNewRecording = () => {
    setStatus('idle');
    setDetectedSpeech('');
    setTranslatedText('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Voice Translator</Text>
        <Text style={styles.subtitle}>
          Speak in one language, hear it in another
        </Text>
      </View>

      {/* Main content */}
      <View style={styles.mainContent}>
        {/* Listening/Recording area */}
        {status === 'idle' && (
          <View style={styles.idleArea}>
            <Ionicons name="mic-outline" size={100} color="#666" />
            <Text style={styles.idleText}>Tap microphone to start speaking</Text>
          </View>
        )}

        {status === 'listening' && (
          <View style={styles.listeningArea}>
            <ListeningAnimation />
            <Text style={styles.listeningText}>Listening...</Text>
            <Text style={styles.statusText}>2 seconds remaining</Text>
          </View>
        )}

        {status === 'processing' && (
          <View style={styles.processingArea}>
            <Ionicons name="hourglass" size={48} color="#ff7a45" />
            <Text style={styles.processingText}>Processing speech...</Text>
            <Text style={styles.detectedText}>{detectedSpeech}</Text>
          </View>
        )}

        {status === 'result' && (
          <View style={styles.resultArea}>
            {/* Detected speech */}
            <View style={styles.speechCard}>
              <Text style={styles.cardTitle}>You said:</Text>
              <Text style={styles.speechText}>{detectedSpeech}</Text>
            </View>

            {/* Language picker */}
            <LanguagePicker
              selectedLang={toLang}
              onLangChange={setToLang}
              label="Translate to:"
            />

            {/* Translation */}
            <View style={styles.translationCard}>
              <Text style={styles.cardTitle}>Translation:</Text>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={20} color="#ffffff" />
                <Text style={styles.translatedText}>{translatedText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action buttons */}
        {status !== 'idle' && (
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={handleNewRecording}
            >
              <Text style={styles.secondaryButtonText}>New Recording</Text>
            </TouchableOpacity>
            
            {status === 'listening' && (
              <TouchableOpacity style={styles.stopButton}>
                <Text style={styles.stopButtonText}>Stop</Text>
              </TouchableOpacity>
            )}
            
            {status === 'processing' && (
              <TouchableOpacity style={styles.primaryButton} onPress={handleProcess}>
                <Text style={styles.primaryButtonText}>Translate</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {status === 'idle' && (
          <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
            <Ionicons name="mic" size={64} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
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

  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  idleArea: {
    alignItems: 'center',
  },
  idleText: {
    color: '#b0b4c3',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },

  listeningArea: {
    alignItems: 'center',
  },
  listeningText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
  },
  statusText: {
    color: '#b0b4c3',
    fontSize: 14,
    marginTop: 8,
  },

  processingArea: {
    alignItems: 'center',
  },
  processingText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 12,
  },
  detectedText: {
    color: '#ff7a45',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  resultArea: {
    alignItems: 'center',
    width: '100%',
  },
  speechCard: {
    backgroundColor: '#161b2b',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  translationCard: {
    backgroundColor: '#1f2740',
    width: '100%',
    padding: 20,
    borderRadius: 20,
  },
  cardTitle: {
    color: '#b0b4c3',
    fontSize: 14,
    marginBottom: 8,
  },
  speechText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  translatedText: {
    color: '#ff7a45',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },

  langPicker: {
    width: '100%',
    marginVertical: 16,
  },
  pickerLabel: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langButton: {
    backgroundColor: '#252a3f',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  langButtonActive: {
    backgroundColor: '#ff7a45',
  },
  langText: {
    color: '#d0d3e0',
    fontSize: 14,
  },
  langTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },

  micContainer: {
    alignItems: 'center',
  },
  soundWaves: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  wave: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 122, 69, 0.4)',
    borderRadius: 3,
  },
  wave1: {
    width: 4,
    height: 20,
    left: 10,
  },
  wave2: {
    width: 4,
    height: 30,
    left: 20,
  },
  wave3: {
    width: 4,
    height: 25,
    left: 30,
  },

  recordButton: {
    backgroundColor: '#ff7a45',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 32,
    width: '100%',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#ff7a45',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#1f2740',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
  },
  stopButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  stopButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
