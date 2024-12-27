import { View, Text, Image, Pressable, ListRenderItem, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import { Course, CurriculumItem, ReviewItem } from '@/types/types'
import { password, username } from '@/utils/apikeys'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { FlatList } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import CurriculumList from '@/components/CurriculumList'

const fetchCourseDetail = async (courseId: string): Promise<Course> => {
  const response = await axios.get<Course>(`https://www.udemy.com/api-2.0/courses/${courseId}`, {
    auth: {
      username: username,
      password: password,
    }
  })
  return response.data
}

const fetchCourseCurriculum = async (courseId: string, page: number = 1): Promise<CurriculumItem> => {
  const response = await axios.get<CurriculumItem>(`https://www.udemy.com/api-2.0/courses/${courseId}/public-curriculum-items/?page=${page}`, {
    auth: {
      username: username,
      password: password,
    }
  })
  return response.data
}

const fetchCourseReviews = async (courseId: string): Promise<Course> => {
  const response = await axios.get<Course>(`https://www.udemy.com/api-2.0/courses/${courseId}/reviews`, {
    auth: {
      username: username,
      password: password,
    }
  })
  return response.data
}

const SegmentedControl: React.FC<{
    selectedSegment: "curriculum" | "reviews",
    onSegmentChange: (segment: "curriculum" | "reviews") => void
}> = ({selectedSegment, onSegmentChange}) => (
    <View className='flex-row mb-4 mt-5 bg-gray-200 p-1 rounded-lg'>
        {/* Curriculum */}
        <Pressable 
        onPress={() => onSegmentChange("curriculum")}
        className={`flex-1 py-3 rounded-md ${
                selectedSegment === "curriculum" ? "bg-blue-700" : "bg-transparent"
            }`}>
                <Text className={`text-center ${
                selectedSegment === "curriculum" ? "text-white" : "text-gray-700"}`}
                style={{
                    fontFamily: selectedSegment === "curriculum" ? "BarlowBold" : "BarlowMedium"
                }}
                >
                    Curriculum
                </Text>
        </Pressable>

        {/* Reviews */}
        <Pressable 
        onPress={() => onSegmentChange("reviews")}
        className={`flex-1 py-3 rounded-md ${
                selectedSegment === "reviews" ? "bg-blue-700" : "bg-transparent"
            }`}>
                <Text className={`text-center ${
                selectedSegment === "reviews" ? "text-white" : "text-gray-700"}`}
                style={{
                    fontFamily: selectedSegment === "reviews" ? "BarlowBold" : "BarlowMedium"
                }}
                >
                    Reviews
                </Text>
        </Pressable>

    </View>
)

const StarRating: React.FC<{rating: number}> = ({rating}) => {
    return (
        <View className='flex-row'>
            {
                [1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name={star <= rating ? "star" : "star-outline"}
                        size={16} color={star <= rating ? "#e68801" : "#D3D3D3" }
                    />
                ))
            }
        </View>
    )
}

const CourseDetail = () => {
    const {courseId} = useLocalSearchParams<{courseId: string}>();
    const [selectedSegment, setSelectedSegment] = useState<"curriculum" | "reviews">("curriculum")
    const [curriculumPage, setCurriculumPage] = useState(1)

    const queryClient = useQueryClient();

    // Course detail
    const {data, error, isLoading, refetch} = useQuery<Course>({
        queryKey: ["courseId", courseId],
        queryFn: () => fetchCourseDetail(courseId || ""),
        enabled: true
    })

    // Curriculum data
    const {
        data: curriculumData, 
        error: curriculumError,
        isLoading: curriculumIsLoading, 
        isFetching: curriculumIsFetching} = useQuery<CurriculumItem>({
        queryKey: ["coursecurriculum", courseId, curriculumPage],
        queryFn: () => fetchCourseCurriculum(courseId || "", curriculumPage),
        enabled: !!courseId,
        keepPreviousData: true
    })

    // Reviews
    const {
        data: reviewsData, 
        error: reviewsError, 
        isLoading: reviewsIsLoading} = useQuery({
        queryKey: ["coursereviews", courseId],
        queryFn: () => fetchCourseReviews(courseId || ""),
        enabled: !!courseId
    })

    const loadMoreCurriculum = () => {
        if(curriculumData.next){
            setCurriculumPage((prev) => prev + 1)
        }
    }

    const mergedCurriculumData = React.useMemo(() => {
        if (!curriculumData) return undefined

        const prevData = queryClient.getQueryData<typeof curriculumData>(
            ["coursecurriculum", courseId, curriculumPage - 1]
        )

        return {
            ...curriculumData,
            results: [...(prevData?.results || []), ...curriculumData.results]
        }
    }, [curriculumData, curriculumPage, courseId, queryClient])

    if(isLoading || (curriculumIsLoading && curriculumPage ===1)){
        return (
            <View className='flex-1 items-center justify-center'>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    if(error || curriculumError || reviewsError){
        return (
            <View className='flex-1 items-center justify-center'>
                <Text>Sorry!something went wrong... {((error || curriculumError || reviewsError) as Error).message}</Text>
            </View>
        )
    }

    if(!data){
        return (
            <View className='flex-1 items-center justify-center'>
                <Text className='text-2xl' style={{fontFamily: "BarlowBold"}}>No Data Available</Text>
            </View>
        )
    }

    const renderReviewsItem: ListRenderItem<ReviewItem> = ({item}) => (
        <View key={item.id} className='mb-4 border-t border-neutral-300 rounded-lg'>
            <View className='flex-row justify-between items-center mb-2'>
                <Text className='text-lg font-bold max-w-64'>
                    {item.user?.display_name}
                </Text>

                <StarRating rating={item.rating} />
            </View>
            <Text className='text-gray-500 text-sm'
                style={{fontFamily: "BarlowMedium"}}
            >
                {new Date(item.created).toLocaleDateString()}
            </Text>

            {
                item.content ? (
                    <Text className='text-gray-600 mt-2 capitalize' style={{fontFamily: "BarlowBold"}}>
                        {item.content}
                    </Text>
                ) : (
                    <Text className='text-gray-600 mt-2 capitalize'>
                        No Comments Provided
                    </Text>
                )
            }
        </View>
    )
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
        <View className='p-2'>
            <View className='bg-blue-700 rounded-xl p-0.5 justify-center mb-4 w-32 items-center'>
                <Text 
                    className='text-base text-white'
                    style={{fontFamily: "BarlowMedium"}}
                >
                    {data?.locale.title}
                </Text>
            </View>

            <View>
                <Text 
                    className='text-2xl'
                    style={{fontFamily: "BarlowBold"}}
                >
                    {data?.title}
                </Text>
            </View>
            
            <View className='flex-row items-center gap-4 mt-3'>
                <Image
                    source={{
                        uri: data?.visible_instructors[0].image_100x100
                    }}
                    className='w-12 h-12 rounded-full'
                />
                <Text 
                    className='text-base text-gray-700'
                    style={{fontFamily: "BarlowMedium"}}
                >
                    {data?.visible_instructors[0]?.display_name}
                </Text>
            </View>

            <View>
                <Text 
                    className='text-2xl mt-3'
                    style={{fontFamily: "BarlowBold"}}
                >
                    {data?.is_paid ? data.price : "Free"}
                </Text>
            </View>
            <SegmentedControl 
                selectedSegment={selectedSegment}
                onSegmentChange={setSelectedSegment}
            />

            {selectedSegment === "reviews" ? (
                <>
                <Text className='text-2xl pb-4' style={{fontFamily: "BarlowBold"}}>
                    Reviews ({reviewsData?.count})
                </Text>
                    <FlatList
                        nestedScrollEnabled={true}
                        scrollEnabled={false}
                        data={reviewsData?.results}
                        renderItem={renderReviewsItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </>
            ) : (
                <>
                    <CurriculumList curriculumData={mergedCurriculumData} 
                        isLoading={curriculumIsLoading}
                        onLoadMore={loadMoreCurriculum}
                    />
                </>
            )
        }
        </View>
    </ParallaxScrollView>
  )
}

export default CourseDetail