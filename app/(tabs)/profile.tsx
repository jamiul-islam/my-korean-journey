import React from "react";
import { StyleSheet, Pressable, Switch, Image } from "react-native";
import { Text, View } from "../../components/Themed";
import { useColorScheme } from "react-native";
import { auth } from "../../lib/firebase";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = React.useState(colorScheme === "dark");

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.profileImage}
        />
        <Text style={{ fontSize: 48, marginBottom: 10 }}>👤</Text>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch value={true} onValueChange={() => {}} />
        </View>

        <Pressable style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2024 My Korean Journey</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
  },
  settingsContainer: {
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  settingLabel: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  version: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  copyright: {
    fontSize: 12,
    color: "#999",
  },
});
