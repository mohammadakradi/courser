import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Course } from '@/types/types';

interface CourseItemProps {
    course: Course;
    customStyle?: string;
    index: number
}

const CourseItem: React.FC<CourseItemProps> = ({course, customStyle, index}) => {
  return (
    <Pressable className={"pt-4 " + (customStyle ? customStyle : "")}>
        <Animated.View 
            className='gap-2 w-full border border-gray-300 overflow-hidden rounded-2xl'
            entering={FadeInDown.duration(100).delay(index * 300).springify()}
        >
            <Image
                source={{
                    uri: course.image_480x270
                }}
                className='w-full h-40'
            />
            <View className='px-4 p-2'>
                <Text style={{fontFamily: 'BarlowBold'}}>{course.title}</Text>
                <View className='flex-row items-center pt-2 pb-4 justify-between'>
                    <Text>
                        {course.is_paid ? `${course.price}`: "Free"}
                    </Text>
                    <Pressable>
                        <Ionicons 
                            color="green"
                            name='heart'
                        />
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    </Pressable>
  )
}

export default CourseItem