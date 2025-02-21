// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    id: "test-id",
  }),
}));

// Mock firebase
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

// Mock Animated
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock Constants for Gemini API
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {
      geminiApiKey: "test-key",
    },
  },
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock the error console to avoid unnecessary error messages in tests
console.error = jest.fn();
