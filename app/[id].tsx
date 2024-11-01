import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Habit, useHabitContext } from "@/app/habitContext";
import { useLocalSearchParams } from "expo-router";
import { BarChart } from "react-native-gifted-charts";

import {
  generateWeeklyReports,
  getStartingMonday,
  calculateStreaks,
} from "@/app/function";

interface DateEntry {
  date: string;
}

interface WeeklyReport {
  value: number;
  label: string;
  topLabelComponent: () => JSX.Element;
}
export interface Streaks {
  currentStreak: number;
  maxStreak: number;
  weeklyStreak: number;
}

import CircularProgress from "react-native-circular-progress-indicator";

const HabitPage: React.FC = () => {
  const { habits } = useHabitContext();
  const { id } = useLocalSearchParams();
  const [graphData, setGraphData] = useState<WeeklyReport[]>([]);
  const [streaks, setStreaks] = useState<Streaks>({
    currentStreak: 0,
    maxStreak: 0,
    weeklyStreak: 0,
  });

  const currentHabit: Habit = habits.find((habit) => habit.id === id) as Habit;

  const pieData = [
    { value: 70, color: "#c919ff", gradientCenterColor: "#ffffff" },
    { value: 30, color: "lightgray" },
  ];

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
    setGraphData(data);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="">
        <Text className="text-5xl font-bold mb-4 text-center text-white uppercase">
          {currentHabit.name}
        </Text>
        <ImageBackground
          style={styles.image}
          // source={require("../assets/images/background.png")}
        >
          <View className="flex-1">
            <View className="flex-1 flex-row justify-between ml-5 mr-5">
              <View className="flex justify-center flex-row items-center mt-4">
                <Text className=" text-3xl font-bold mb-4 text-center text-white">
                  Weekly
                </Text>
                <Text className=" text-3xl italic font-bold mb-4 text-center text-[#2465FD]">
                  {" Statistics"}
                </Text>
              </View>
              <View>
                <CircularProgress
                  value={
                    ((graphData[0]?.value ?? 0) / currentHabit.frequency) * 100
                  }
                  progressValueFontSize={1}
                  title={`${graphData[0]?.value ?? 0} / ${
                    currentHabit.frequency
                  }`}
                  titleStyle={{ color: "#ffffff", fontSize: 30 }}
                  activeStrokeColor={"#2465FD"}
                  activeStrokeSecondaryColor={"#C25AFF"}
                  inActiveStrokeColor="#1E1E1E"
                  progressValueStyle={{ fontWeight: "700", color: "white" }}
                  dashedStrokeConfig={{
                    count: currentHabit.frequency,
                    width: 360 / currentHabit.frequency,
                  }}
                />
              </View>
            </View>
            <Text className="text-4xl italic font-bold mb-4 text-start text-[#2465FD] ml-5">
              Streaks
            </Text>
            <View className=" justify-around">
              <View className="flex justify-center">
                <View className="flex-row mt-5 justify-between grid-cols-3 ml-5 mr-5">
                  <View className="flex-row">
                    <Text className=" text-2xl font-bold mb-4 text-center text-white col-span-2">
                      Current
                    </Text>
                    <Text className=" text-2xl font-bold mb-4 text-center text-[#ff66f4] italic col-span-2">
                      {"  Streak "}
                      {streaks.currentStreak && streaks.currentStreak > 0
                        ? "  🔥"
                        : "  ☁️"}
                    </Text>
                  </View>

                  <Text className="text-2xl font-bold mb-4 text-center text-[#ff66f4] col-span-1">
                    {streaks.currentStreak}
                  </Text>
                </View>
                <View className="flex-row mt-5 justify-between grid-cols-3 ml-5 mr-5">
                  <View className="flex-row">
                    <Text className=" text-2xl font-bold mb-4 text-center text-white col-span-2">
                      Maximum
                    </Text>
                    <Text className=" text-2xl font-bold mb-4 text-center text-[#2465FD] italic col-span-2">
                      {" Streak "}
                      {streaks.maxStreak &&
                      streaks.currentStreak > 0 &&
                      streaks.maxStreak === streaks.currentStreak
                        ? "  🔥"
                        : "  😎"}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold mb-4 text-center  col-span-1 text-[#2465FD]">
                    {streaks.maxStreak}
                  </Text>
                </View>
                <View className="flex-row mt-5 justify-between ml-5 mr-5">
                  <View className="flex-row">
                    <Text className=" text-2xl font-bold mb-4 text-center text-white col-span-2">
                      Weekly
                    </Text>
                    <Text className=" text-2xl font-bold mb-4 text-center text-[#ff66f4] italic col-span-2">
                      {"  Streak "}
                      {streaks.weeklyStreak && streaks.weeklyStreak > 0
                        ? "  🔥"
                        : "  ☁️"}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold mb-4 text-center text-[#ff66f4]">
                    {streaks.weeklyStreak}
                  </Text>
                </View>
                <View className="flex-row mt-5 justify-between ml-5 mr-5">
                  <View className="flex-row">
                    <Text className=" text-2xl font-bold mb-4 text-center text-white col-span-2">
                      Total
                    </Text>
                    <Text className=" text-2xl font-bold mb-4 text-center text-[#2465FD] italic col-span-2">
                      {"  Activity "}
                    </Text>
                  </View>
                  <Text className="text-2xl font-bold mb-4 text-center text-[#2465FD]">
                    {currentHabit.dates.length}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-1 rounded-lg m-4 blur-2xl">
            <View className="flex justify-center mb-4  flex-row items-center">
              <Text className=" text-3xl font-bold mb-4 text-center text-white">
                Weekly
              </Text>
              <Text className=" text-3xl italic font-bold mb-4 text-center text-[#2465FD]">
                {" Report"}
              </Text>
            </View>
            <Image
              source={require("../assets/images/walls.png")}
              style={{
                position: "absolute",
                opacity: 0.6,
                height: 300,
                width: 400,
                resizeMode: "contain",
              }}
              className="rounded-lg -ml-3"
            />
            <View style={{ marginLeft: 25 }}>
              <BarChart
                data={graphData}
                isThreeD
                initialSpacing={20}
                spacing={40}
                barMarginBottom={10}
                showGradient
                gradientColor={"#fc84ff"}
                hideYAxisText
                yAxisThickness={0}
                xAxisThickness={0}
                xAxisColor={"#c919ff"}
                frontColor={"transparent"}
                sideColor={"#ff00d0"}
                topColor={"#ff66f4"}
                maxValue={7}
                barStyle={{
                  borderWidth: 4,
                  borderColor: "#fc84ff",
                  shadowColor: "#fc84ff",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 1,
                  shadowRadius: 8,
                  elevation: 10,
                }}
                hideRules
                isAnimated
                height={120}
                barWidth={15}
                xAxisLabelTextStyle={{
                  color: "#ffffff",
                  fontWeight: 900,
                }}
              />
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HabitPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover", // Adjust as needed: 'contain', 'stretch', etc.
    justifyContent: "center", // Center the text vertically
    position: "relative",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
