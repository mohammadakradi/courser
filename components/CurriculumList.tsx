import { View, Text, ActivityIndicator, Pressable } from 'react-native'
import React from 'react'

import { CurriculumItem } from '@/types/types'
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

interface CurriculumData {
    count: number;
    next: string | null;
    previous: string | null;
    results: CurriculumItem
}

interface CurriculumListProps {
    curriculumData: CurriculumData;
    isLoading: boolean;
    onLoadMore: () => void;
}

const CurriculumList: React.FC<CurriculumListProps> = ({
    curriculumData,
    isLoading,
    onLoadMore
}) => {
    if(!curriculumData){
        return <Text>No Curriculum Data Available</Text>
    }

    if(isLoading){
        <View className='p-12'>
            <ActivityIndicator size='large' color='#0000ff' />
        </View>
    }

    const renderItem = ({item}: {item: CurriculumItem}) => (
        <View className='border-t border-[#eee] p-4'>
            {
                item._class === "chapter" ? (
                    <Text className='text-lg' style={{fontFamily: "BarlowBold"}}>
                        {item.title}
                    </Text>
                ) : (
                    <View>
                        <Text  className='text-lg ml-4' style={{fontFamily: "BarlowSemiBold"}}>
                            {item.title}
                        </Text>
                        {
                            item._class === "lecture" && (
                                <Ionicons className='ml-4 text-blue-700' name={item.is_free ? "lock-open-outline" : "lock-closed-outline"} size={16} color={item.is_free ? "#1d4ed8" : "#374151"} />
                            )
                        }

                        {
                            item._class === "quiz" && (
                                <Text  className='pl-4' style={{fontFamily: "BarlowSemiBold"}}>
                                    Quiz
                                </Text>
                            )
                        }
                    </View>
                )
            }

        </View>
    )

    const renderFooter = () => {
        if(!isLoading) return null;
        return (
            <View className='p-12'>
                <ActivityIndicator size='large' color='#0000ff' />
            </View>
        )
    }

  return (
    <View>
      <Text className='text-2xl' style={{fontFamily: "BarlowBold"}}>Course Curriculum: {curriculumData.count} Items</Text>
      <FlatList 
        nestedScrollEnabled={true}
        scrollEnabled={false}
        data={curriculumData.results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
      />
      {
        curriculumData.next && !isLoading && (
            <Pressable onPress={onLoadMore}
                className='bg-gray-200 py-4 rounded-2xl'
            >
                <Text className='text-center text-gray-700 text-lg'>Load More ...</Text>
            </Pressable>
        )
      }
    </View>
  )
}

export default CurriculumList