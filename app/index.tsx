import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  ImageBackground,
  Pressable,
} from "react-native";
import HabitList from "@/app/habitList";
import HabitModal from "./addingHabit";

const App: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[url('')]">
      <ImageBackground
        source={require("../assets/images/mainbg.png")}
        style={styles.image}
      >
        <View className="p-4 flex-1">
          <Text className="mt-5 text-5xl font-bold mb-4 text-center text-white">
            Habifiy
          </Text>
          <HabitList />
        </View>
        <HabitModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        <Pressable onPress={() => setIsModalVisible(true)}>
          <View className="absolute flex items-end justify-end w-32 h-20 bottom-8 right-8">
            <View className="w-14 h-14 bg-zinc-700 rounded-full items-center justify-center">
              <Text className="text-white text-3xl">+</Text>
            </View>
          </View>
        </Pressable>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover", // Adjust as needed: 'contain', 'stretch', etc.
    justifyContent: "center", // Center the text vertically
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
