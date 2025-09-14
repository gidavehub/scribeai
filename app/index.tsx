// app/index.tsx

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image, // Import Image component
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DrawingOrchestrator } from '../components/DrawingOrchestrator';
import { PannableCanvas } from '../components/PannableCanvas';
import {
  OrchestratorInstruction,
  parseAiCommandsToInstructions,
  ParsedScript,
} from '../core/JsonToPathParser';
import { getDrawingScriptFromGemini } from '../services/geminiService';

// Animation
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// Ionicons
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Image Picker
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [instructions, setInstructions] = useState<OrchestratorInstruction[]>([]);
  const [viewBox, setViewBox] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  // State for the image
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Function to handle image picking
  const handleImagePick = async () => {
    // Ask for permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Lower quality for faster upload and to fit context window
      base64: true, // Ask for the base64 data directly
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64);
    }
  };

  // --- API CALL HANDLER ---
  const handleSolve = async () => {
    // Validate that there is either a text problem or an image
    if ((!problem || problem.trim() === '') && !imageBase64) {
        Alert.alert("Input Required", "Please type a problem or upload an image to solve.");
        return;
    }
    if (isLoading) return;

    setIsLoading(true);
    setInstructions([]);
    setViewBox(null);

    try {
      // Pass both the problem text and the image base64 string to the service
      const aiCommands = await getDrawingScriptFromGemini(problem, imageBase64);
      const parsedScript: ParsedScript =
        parseAiCommandsToInstructions(aiCommands);

      setInstructions(parsedScript.instructions);
      setViewBox(parsedScript.viewBox);
      setTrigger((prev) => prev + 1);

    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'An unknown error occurred.'
      );
    } finally {
      setIsLoading(false);
      // Clear image and text after solving
      setImageUri(null);
      setImageBase64(null);
      setProblem('');
    }
  };

  // --- ANIMATED GLOW ---
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 6000 }), -1, true);
  }, []);

  const glowStyle = useAnimatedStyle(() => {
    const glowColor = interpolateColor(
      progress.value,
      [0, 0.33, 0.66, 1],
      ['#007AFF', '#00FF7F', '#FFA500', '#7B68EE']
    );
    return {
      shadowColor: glowColor,
      shadowOpacity: 1,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 0 },
      borderColor: glowColor,
    };
  });

  // --- RENDER ---
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Canvas */}
        <View style={styles.canvasContainer}>
          <PannableCanvas>
            <DrawingOrchestrator
              instructions={instructions}
              viewBox={viewBox}
              trigger={trigger}
            />
          </PannableCanvas>
        </View>

        {/* Image Preview */}
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageButton} 
              onPress={() => {
                setImageUri(null);
                setImageBase64(null);
              }}
            >
              <Ionicons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Floating input */}
        <Animated.View style={[styles.inputContainer, glowStyle]}>
          {/* Image button on the left */}
          <TouchableOpacity style={styles.iconButton} onPress={handleImagePick}>
            <Ionicons name="image-outline" size={22} color="white" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder={imageUri ? "Describe the image..." : "Ask a math problem..."}
            placeholderTextColor="#999"
            value={problem}
            onChangeText={setProblem}
            onSubmitEditing={handleSolve}
            editable={!isLoading}
          />

          {isLoading ? (
            <ActivityIndicator color="#007AFF" style={styles.activityIndicator}/>
          ) : (
            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="mic-outline" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleSolve}>
                <Ionicons name="send" size={22} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  canvasContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  imagePreviewContainer: {
    position: 'absolute',
    bottom: 110, // Position above the input container
    left: 20,
    flexDirection: 'row',
  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 12,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    elevation: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    marginHorizontal: 10,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
  },
  activityIndicator: {
    // Ensure the activity indicator takes up the same space as the buttons
    width: 68, // Approximate width of mic + send button + padding
  },
});