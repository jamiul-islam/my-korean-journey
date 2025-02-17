import { SafeAreaView, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { useBoxStore } from "../../stores/boxStore";
import AddBoxButton from "../../components/AddBoxButton";
import BoxList from "../../components/BoxList";
import React from "react";

export default function HomeScreen() {
  const boxes = useBoxStore((state) => state.boxes);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {boxes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.title}>Welcome to My Korean Journey!</Text>
            <Text style={styles.subtitle}>
              Start by creating your first word box
            </Text>
            <AddBoxButton />
          </View>
        ) : (
          <BoxList boxes={boxes} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: "#f1f1f1",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
});
