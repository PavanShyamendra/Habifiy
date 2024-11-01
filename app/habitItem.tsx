import React, { useEffect, useState } from "react";
import { View, Text, Pressable, TouchableOpacity, Alert } from "react-native";
import { dateKey, Habit, useHabitContext } from "@/app/habitContext";
import {
  CalendarDaysIcon,
  Icon,
  CheckCircleIcon,
  TrashIcon,
  EditIcon,
} from "@/components/ui/icon";
import { router } from "expo-router";
import { Swipeable } from "react-native-gesture-handler";
import HabitModal from "./addingHabit";
import { set } from "date-fns";

import {
  generateWeeklyReports,
  getStartingMonday,
  calculateStreaks,
} from "@/app/function";
import { Streaks } from "./[id]";

interface HabitItemProps {
  id: string;
  name: string;
  frequency: number;
  dates: dateKey[];
}

const HabitItem: React.FC<HabitItemProps> = ({
  id,
  name,
  frequency,
  dates,
}) => {
  const { modifyHabit, deleteHabit, habits } = useHabitContext();
  const [currentDate, setCurrentDate] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [streaks, setStreaks] = useState<Streaks>({
    currentStreak: 0,
    maxStreak: 0,
    weeklyStreak: 0,
  });

  const currentHabit = habits.find((habit) => habit.id === id) as Habit;

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setCurrentDate(`${day}-${month}-${year}`);
  }, []);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const data = generateWeeklyReports(
      currentHabit.dates,
      getStartingMonday(`${day}-${month}-${year}`),
      6
    );
    const streaks = calculateStreaks(currentHabit.dates);
    setStreaks(streaks);
  }, [habits]);

  const loginDay = () => {
    if (dates.length == 0) {
      modifyHabit(id, {
        dates: [{ date: currentDate }],
      });
    }
    if (dates.length && dates[dates.length - 1].date !== currentDate) {
      modifyHabit(id, {
        dates: [...dates, { date: currentDate }],
      });
    }
    if (dates.length && dates[dates.length - 1].date === currentDate) {
      modifyHabit(id, {
        dates: dates.filter((date) => date.date !== currentDate),
      });
    }
  };
  return (
    <Swipeable
      friction={2}
      renderRightActions={() => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Careful",
              "Your habit will be deleted and all the data is gone for good",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    deleteHabit(id);
                  },
                },
              ]
            );
          }}
          className="flex w-3/12 mb-4 bg-red-500 justify-center items-center rounded-r-lg"
        >
          <Icon as={TrashIcon} className="w-8 h-8" color={"#fff"} />
        </TouchableOpacity>
      )}
      renderLeftActions={() => (
        <View className="flex w-3/12 mb-4">
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            className="bg-green-500 flex justify-center items-center h-full rounded-l-lg"
          >
            <Icon as={EditIcon} className="w-8 h-8" color={"#fff"} />
          </TouchableOpacity>
        </View>
      )}
    >
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/[id]",
            params: { id },
          });
        }}
        className="hover:bg-zinc-900/[.6]"
      >
        <View className="bg-zinc-900/[.8] shadow-xl rounded-xl p-4 mb-4">
          <View className="flex-row justify-between">
            <Text className="text-white text-3xl mb-4">{name}</Text>
            <Pressable onPress={loginDay}>
              <View className="mt-2 w-12">
                <Icon
                  as={CheckCircleIcon}
                  className="w-8 h-8"
                  color={`${
                    currentDate ===
                    (dates.length && dates[dates.length - 1].date)
                      ? "#2465FD"
                      : "#ff66f4"
                  }`}
                />
              </View>
            </Pressable>
          </View>
          <View className="flex-row items-center space-x-6">
            <View className="w-12 h-12 mr-2 bg-zinc-800 rounded-full items-center justify-center">
              <Icon
                as={CalendarDaysIcon}
                className=""
                color={`${
                  currentDate === (dates.length && dates[dates.length - 1].date)
                    ? "#2465FD"
                    : "#ff66f4"
                }`}
              />
            </View>
            <View className="flex-row flex-1 justify-between">
              <View>
                <Text className="text-zinc-400 text-sm">Current Streak:</Text>
                <Text className="text-center text-white">
                  {streaks.currentStreak} days
                </Text>
              </View>
              <View>
                <Text className="text-zinc-400 text-sm">Max Streak:</Text>
                <Text className="text-center text-white">
                  {streaks.maxStreak} days
                </Text>
              </View>
              <View>
                <Text className="text-zinc-400 text-sm">Weekly:</Text>
                <Text className="text-center text-white">
                  {streaks.weeklyStreak}/7
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
      <HabitModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        Action="Edit"
        id={id}
      />
    </Swipeable>
  );
};

export default HabitItem;
