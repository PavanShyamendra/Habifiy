import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getData, saveData } from "./repository";

export interface dateKey {
  date: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: number;
  dates: dateKey[];
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id">) => void;
  deleteHabit: (id: string) => void;
  modifyHabit: (id: string, updatedHabit: Partial<Habit>) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabitContext = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabitContext must be used within a HabitProvider");
  }
  return context;
};

export const HabitProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const savedHabits = await getData("habits");
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits));
        }
      } catch (error) {
        console.error("Failed to load habits from storage:", error);
      }
    };
    loadHabits();
  }, []);
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await saveData("habits", JSON.stringify(habits));
      } catch (error) {
        console.error("Failed to save habits to storage:", error);
      }
    };
    saveHabits();
  }, [habits]);

  const addHabit = (habit: Omit<Habit, "id">) => {
    const newHabit = { ...habit, id: Date.now().toString() };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };

  const modifyHabit = (id: string, updatedHabit: Partial<Habit>) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, ...updatedHabit } : habit
      )
    );
  };

  return (
    <HabitContext.Provider
      value={{ habits, addHabit, deleteHabit, modifyHabit }}
    >
      {children}
    </HabitContext.Provider>
  );
};
