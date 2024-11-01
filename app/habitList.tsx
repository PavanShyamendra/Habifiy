import React, { RefObject, useRef } from "react";
import { View, Text, FlatList, ListRenderItemInfo } from "react-native";
import { dateKey, useHabitContext } from "@/app/habitContext";
import HabitItem from "./habitItem";

interface Habit {
  id: string;
  name: string;
  frequency: number;
  dates: dateKey[];
}

const HabitList: React.FC = () => {
  const { habits } = useHabitContext();

  const renderItem = ({ item }: ListRenderItemInfo<Habit>) => (
    <HabitItem
      id={item.id}
      name={item.name}
      frequency={item.frequency}
      dates={item.dates}
    />
  );

  if (habits.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">No habits added yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={habits}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
      }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">No habits added yet.</Text>
        </View>
      }
    />
  );
};

export default HabitList;
