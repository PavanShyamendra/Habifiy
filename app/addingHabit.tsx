import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useHabitContext } from "./habitContext";

interface HabitModalProps {
  visible: boolean;
  onClose: () => void;
  Action?: string;
  id?: string;
}

const HabitModal = ({
  visible,
  onClose,
  Action = "Add",
  id = "",
}: HabitModalProps) => {
  const [name, setHabitName] = useState("");
  const [frequency, setFrequency] = useState("3");

  const { addHabit, habits, modifyHabit } = useHabitContext();

  useEffect(() => {
    if (Action === "Edit") {
      const habit = habits.find((habit) => habit.id === id);
      if (habit) {
        setHabitName(habit.name);
        setFrequency(habit.frequency.toString());
      }
    }
  }, [Action, id]);

  const handleSubmit = () => {
    if (Action === "Edit") {
      if (name && frequency) {
        modifyHabit(id, {
          name,
          frequency: parseInt(frequency),
        });
        setHabitName("");
        setFrequency("3");
        onClose();
      }
    } else {
      if (name && frequency) {
        addHabit({
          name,
          frequency: parseInt(frequency),
          dates: [],
        });
        setHabitName("");
        setFrequency("3");
        onClose();
      }
    }
  };
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    // Clean up listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleOutsideClick = () => {
    onClose();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick}>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        {isKeyboardVisible && visible && (
          <View className="flex justify-center absolute top-24 bg-zinc-900/[.8] w-10/12 h-1/4">
            <Text className="text-center text-5xl text-white italic">
              {name}
            </Text>
          </View>
        )}
        <View className="absolute bottom-0 w-full">
          <View className="bg-zinc-900 rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-semibold">
                {Action} New Habit
              </Text>
              <Pressable
                onPress={onClose}
                className="flex items-center justify-center w-12 h-12"
              >
                <Text className="text-white text-xl font-semibold">✕</Text>
              </Pressable>
            </View>

            <View className={`space-y-4 `}>
              <View className={`${isKeyboardVisible ?? "mb-44"} `}>
                <Text className="text-zinc-400 mb-2">Habit Name</Text>
                <TextInput
                  className="bg-zinc-800 text-white p-4 rounded-xl"
                  placeholder="Enter habit name"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setHabitName}
                />
              </View>

              <View className="mt-2">
                <Text className="text-zinc-400 mb-2">Target</Text>
                <View className="flex-row space-x-2">
                  {["3", "5", "7"].map((freq) => (
                    <Pressable
                      key={freq}
                      onPress={() => setFrequency(freq)}
                      className={`m-1 px-4 py-2 rounded-full ${
                        frequency === freq ? "bg-zinc-700" : "bg-zinc-800"
                      }`}
                    >
                      <Text className="text-white capitalize">{freq} Days</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={handleSubmit}
                className="bg-zinc-700 p-4 rounded-xl mt-4 mb-4"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {Action} Habit
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  );
};

export default HabitModal;
