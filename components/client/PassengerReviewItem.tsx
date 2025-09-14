import { View, Text, Image, Modal, TouchableOpacity } from 'react-native'
import React, { memo, useCallback, useMemo, useState } from 'react'
import Toast from 'react-native-toast-message'
import { ReviewItem } from '@/types/app-types'
import api from '@/hooks/useApi'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { toFixedNoRound } from '@/utils/toFixed'
import { Trash2, X } from 'lucide-react-native'
import { useQueryClient } from '@tanstack/react-query'

const PassengerReviewItem = ({item}: {item: ReviewItem}) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient();

    const deleteReview = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.delete(`/reviews/delete-review-passenger/${item.id}`);
            if(res.data.success){
                Toast.show({
                    type: "success",
                    text1: "Sukses",
                    text2: `Sapo keni fshire vleresimin ndaj shoferit ${item.driver.fullName}`
                })
                queryClient.invalidateQueries({queryKey: ['reviews-made']});
            }
        } catch (error: any) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: "Gabim",
                text2: error.response.data.message || "Dicka shkoi gabim. Ju lutem provoni perseri."
            })
        } finally {
            setLoading(false)
            setModalVisible(false)
        }
    }, [setLoading, setModalVisible, item])

    const renderStars = useMemo(() => (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
        <Ionicons
            key={index}
            name={index < rating ? 'star' : 'star-outline'}
            size={16}
            color={index < rating ? '#fbbf24' : '#d1d5db'}
        />
        ));
    }, []);

  return (
    <>
        <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-white rounded-2xl p-4 shadow shadow-black/5 mb-3 relative">
            {/* Rating and Date */}
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row justify-between flex-1">
                    <View className='justify-between flex-col flex-1'>
                        <View>
                            <View className='flex-row'>
                                {renderStars(item.rating)}
                            </View>
                            <Text className="text-xs text-gray-500">
                            {dayjs(item.createdAt).format('D MMM YYYY')}
                            </Text>
                        </View>
                        <View>
                        {item.comment && (
                            <Text className="text-gray-700 text-sm font-pregular">
                            "{item.comment}"
                            </Text>
                        )}
                        </View>
                    </View>
                    <View>
                        <Image source={{uri: item.driver.image}} className='rounded-full ml-auto' style={{width: 60, height: 60}}/>
                        <Text className='font-pmedium text-sm text-indigo-950 text-right'>{item.driver.fullName}</Text>
                    </View>
                </View>
            </View>


            {/* Ride Details */}
            <View className="border-t border-gray-100 pt-3">
                <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-gray-500">Nga:</Text>
                <Text className="text-xs font-pmedium text-indigo-950">{item.ride.fromAddress}</Text>
                </View>
                
                <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-gray-500">Deri:</Text>
                <Text className="text-xs font-pmedium text-indigo-950">{item.ride.toAddress}</Text>
                </View>
                
                <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xs text-gray-500">Data:</Text>
                <Text className="text-xs font-pmedium text-indigo-950">
                    {dayjs(item.ride.updatedAt).format('D MMM YYYY, HH:mm')}
                </Text>
                </View>
                
                <View className="flex-row justify-between items-center ">
                <Text className="text-xs text-gray-500">Çmimi:</Text>
                <Text className="text-xs font-pmedium text-indigo-600">{toFixedNoRound(item.ride.price, 2)} €</Text>
                </View>

                <View className="flex-row justify-between items-center mt-2">
                <Text className="text-xs text-gray-500">Lloji udhetimit:</Text>
                <Text className="text-xs font-pmedium text-red-600">{item.ride.isUrgent ? "Urgjent" : "Normal"}</Text>
                </View>

            </View>
        </TouchableOpacity>

        {/* Modal for actions */}
        <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white w-11/12 rounded-2xl p-5">
            <Text className="text-lg font-psemibold text-gray-800 mb-4">
                Ndervepro me vleresimin
            </Text>

            
            {/* Delete Button */}
            <TouchableOpacity
                disabled={loading}
                onPress={deleteReview}
                className={`flex-row items-center gap-2 bg-red-600 px-4 py-3 rounded-xl mb-3 ${loading && "opacity-30"}`}
            >
                <Trash2 size={18} color="white" />
                <Text className="text-white font-pregular">{loading ? "Duke fshire" : "Fshij"}</Text>
            </TouchableOpacity>

            {/* Close */}
            <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-row items-center gap-2 bg-gray-200 px-4 py-3 rounded-xl"
            >
                <X size={18} color="black" />
                <Text className="text-gray-700 font-pregular">Mbyll</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
        </>
  )
}

export default memo(PassengerReviewItem)