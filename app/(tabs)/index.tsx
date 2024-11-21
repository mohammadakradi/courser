import { HelloWave } from "@/components/HelloWave";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  {id: "business", name: "Business", icon: "briefcase"},
  {id: "tech", name: "Tech", icon: "hardware-chip"},
  {id: "design", name: "Design", icon: "color-palette"},
  {id: "marketing", name: "Marketing", icon: "megaphone"},
  {id: "health", name: "Health", icon: "fitness"},
  {id: "music", name: "Music", icon: "musical-notes"},
  {id: "lifestyle", name: "Lifestyle", icon: "heart"},
]


export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const renderCategory = (item: Category) => (
    <Pressable onPress={() => setSelectedCategory(item.id)}
      className="mr-4 p-2 rounded-full items-center flex-col gap-4"
    >
      <View className={`p-4 rounded-full flex-row items-center ${selectedCategory === item.id ? "border-2 border-blue-700" : "border border-gray-400"}`}>
        <Ionicons name={item.icon as any} size={24} color={selectedCategory === item.id ? "#1d4ed8" : "gray"} />
      </View>
        <Text style={{ fontFamily: selectedCategory === item.id ? "BarlowBold" : "BarlowMedium"}}>
          {item.name}
        </Text>
    </Pressable>
  )

  return (
    <View className="flex-1 bg-white">
      {/* Greetings */}
      <View className="pt-16 pb-6 px-6 bg-[#2563eb]">
        <Animated.View
          className='flex-row justify-between items-center'
        >
          <View>
            <View className="flex-row items-end gap-2">
              <Text className="text-lg text-white" style={{ 'fontFamily': 'BarlowSemiBold' }}>Bonjour</Text>
              <View>
                <HelloWave />
              </View>
            </View>

            <Text className="text-white text-2xl" style={{'fontFamily': 'BarlowBold'}}>
              Mohammad Akradi
            </Text>

          </View>
          <View>
            <MaterialCommunityIcons
              name="bell-badge-outline"
              size={30}
              color="white"
            />
          </View>
        </Animated.View>

        {/* Search */}
        <Pressable onPress={() => router.push("/explore")}>
          <View className="flex-row items-center bg-white/20 rounded-2xl p-4 mt-4">
            <MaterialCommunityIcons name="magnify" size={25} color="white" />
            <Text className="text-white ml-2" style={{'fontFamily': 'BarlowMedium'}}>
              What do you want to learn today?
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="bg-white flex-1 gap-4">
        {/* Categories */}
        <Animated.View className='gap-6'
          entering={FadeInDown.duration(500).delay(200).springify()}
        >
          <View className="flex-row justify-between px-6 pt-4 items-center">
            <Text className="text-xl"
              style={{'fontFamily': 'BarlowSemiBold'}}
            >Explore Topics</Text>

            <Text className="text-blue-700" style={{'fontFamily': 'BarlowSemiBold'}}>See more</Text>
          </View>

          {/* List of Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4 pl-4"
          >
            {
              categories.map((category) => (
                <View
                  key={category.id}
                >
                  {renderCategory(category)}
                </View>
              ))
            }
          </ScrollView>
          <View>

          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
