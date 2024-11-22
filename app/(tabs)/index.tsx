import CourseItem from "@/components/CourseItem";
import { HelloWave } from "@/components/HelloWave";
import { password, username } from "@/utils/apikeys";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Course {
  id: number;
  title: string;
  subtitle: string;
  image_480x270: string;
  is_paid: boolean;
  price: string;
  num_reviews: number
}

interface SearchResponse {
  results: Course[];
}

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

const fetchCourses = async (searchTerm: string): Promise<SearchResponse> => {
  const response = await axios.get(`https://www.udemy.com/api-2.0/courses/`, {
    params: {search: searchTerm},
    auth: {
      username: username,
      password: password,
    }
  })

  return response.data
}

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('business');

  const {data, error, isLoading, refetch} = useQuery({
    queryKey: ["searchCourses", selectedCategory],
    queryFn: () => fetchCourses(selectedCategory),
    enabled: true
  })

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
        </Animated.View>

        {/* Category Courses */}
        {
          isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#2563eb" />
            </View>
          ) : error ? (
            <Text>Error: {(error as Error).message}</Text>
          ) : data?.results ? (
            <FlatList 
              horizontal={true}
              data={data.results}
              renderItem={({item}) => {
                return <CourseItem course={item} customStyle="w-[22rem] pl-6" />
              }}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>No courses founded. Try another topic.</Text>
            </View>
          )
        }
      </ScrollView>
    </View>
  );
}
