import { View, Text, Image } from 'react-native'
import React from 'react'
import axios from 'axios'
import { Course } from '@/types/types'
import { password, username } from '@/utils/apikeys'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import ParallaxScrollView from '@/components/ParallaxScrollView'

const fetchCourseDetail = async (courseId: string): Promise<Course> => {
  const response = await axios.get<Course>(`https://www.udemy.com/api-2.0/courses/${courseId}`, {
    auth: {
      username: username,
      password: password,
    }
  })

  return response.data
}

const CourseDetail = () => {
    const {courseId} = useLocalSearchParams<{courseId: string}>();

    const {data, error, isLoading, refetch} = useQuery<Course>({
        queryKey: ["courseId", courseId],
        queryFn: () => fetchCourseDetail(courseId || ""),
        enabled: true
    })
  return (
    <ParallaxScrollView
        headerBackgroundColor={{light: "#D0D0D0", dark: "#353636"}}
        headerImage={
            <Image
                source={{
                    uri: data?.image_480x270
                }}
                className='w-full h-72 rounded-lg'
            />
        }
    >
        <View>
            <View className='bg-blue-700 rounded-xl p-0.5 justify-center mb-4 w-32 items-center'>
                <Text 
                    className='text-base text-white'
                    style={{fontFamily: "BarlowMedium"}}
                >
                    {data?.locale.title}
                </Text>
            </View>
            <Text>{courseId}</Text>
        </View>
    </ParallaxScrollView>
  )
}

export default CourseDetail