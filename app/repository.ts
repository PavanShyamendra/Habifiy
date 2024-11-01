import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const saveData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Data successfully saved",
    });
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // console.log("Data retrieved:", value);
      return value; // Return the retrieved value
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
  }
};

const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("Data successfully removed");
  } catch (error) {
    console.log("Error removing data:", error);
  }
};

const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log("All data cleared");
  } catch (error) {
    console.log("Error clearing data:", error);
  }
};

export { saveData, getData, removeData, clearAllData };
