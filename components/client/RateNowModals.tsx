import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React, { Dispatch, memo, SetStateAction, useCallback, useState } from 'react'
import { Frown, Laugh, Meh, Smile, Star, X } from 'lucide-react-native';
import { ActivePassengerRide } from '@/types/app-types';
import Toast from 'react-native-toast-message';
import TextField from '../TextField';
import api from '@/hooks/useApi';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const RateNowModals = ({rateModal, setRateModal, rate2Modal, setRate2Modal, ride}: 
    {rateModal: boolean; setRateModal: Dispatch<SetStateAction<boolean>>; rate2Modal: boolean; ride: ActivePassengerRide; setRate2Modal: Dispatch<SetStateAction<boolean>>}) => {

    const [selectedRating, setSelectedRating] = useState<number | null>(null)
    const [reviewDescription, setReviewDescription] = useState("")


    const submitReview = useCallback(async () => {
        if(!selectedRating){
            Toast.show({
                type: "error",
                text1: "Gabim",
                text2: "Ju lutem vleresoni shoferin me nota prej 1-5"
            })
            
            return;
        }
        try {
            const payload = {
                driverId: ride.driver.driverId,
                connectedRideId: ride.id,
                reviewContent: reviewDescription,
                rating: selectedRating
            }
            const res = await api.post('/reviews/make-review', payload);
            if(res.data.success){
                setRate2Modal(false);
                Toast.show({
                    type: "success",
                    text1: "Sukses",
                    text2: `Ju keni vleresuar me sukses shoferin ${ride.driver.fullName}`
                })
                setSelectedRating(null)
                setReviewDescription("")
            }
        } catch (error: any) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: "Gabim",
                text2: error.response.data.message || "Dicka shkoi gabim, ju lutem provoni perseri."
            })
        }
    }, [ride, selectedRating, reviewDescription, setRate2Modal, setSelectedRating, setReviewDescription, Toast])

  return (
    <>
     <Modal visible={rateModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-xl p-5 w-11/12">
            <Text className="text-lg font-psemibold text-indigo-950 mb-3">
              Dëshironi të vlerësoni shoferin?
            </Text>
            <Text className="text-gray-700 text-sm">Ky modal shërben për vlerësimin e shoferit <Text className="font-psemibold text-indigo-600">{ride.driver.fullName}</Text></Text>
            <Text className="text-indigo-600 text-sm mb-3">Për të proceduar në vlerësimin e shoferit shtypni butonin <Text className="font-psemibold">"Procedo"</Text></Text>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setRateModal(false)}
                className="px-4 py-1.5 rounded-lg flex-row items-center gap-1 bg-red-600"
              >
                <Text className="text-white font-pregular">Mbyll</Text>
                <X color={"white"} size={18} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setRateModal(false);
                  setRate2Modal(true);
                }}
                className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center gap-1"
              >
                <Text className="text-white font-pregular">Procedo</Text>
                <Star color={"white"} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

        {/* rate now modal */}
      <Modal visible={rate2Modal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white rounded-xl p-5 w-11/12">
            <KeyboardAwareScrollView>
                <Text className="text-lg font-psemibold text-indigo-950 mb-3">
                    Vlerësoni tani shoferin
                </Text>
                <Text className="text-gray-700 text-sm text-center leading-none mb-1">
                    Ky modal për vlerësimin e shoferit{" "}
                    <Text className="text-indigo-600">{ride.driver.fullName}</Text>{" "}
                    duhet të jap vlerësime të sinqerta në lidhje me sjelljen apo udhëtimin tuaj.
                </Text>
                <Text className="font-psemibold text-sm text-center mb-3">
                    (Çdo vlerësim i rrejshëm rezulton në pezullimin e përhershëm të llogarisë tuaj.)
                </Text>

                {/* Rating Options */}
                <View className="flex-row justify-between mb-2">
                    {[
                    { icon: Frown, label: "Shumë Keq", value: 1, color: "#DC2626" },
                    { icon: Meh, label: "Keq", value: 2, color: "#F97316" },
                    { icon: Smile, label: "Mirë", value: 3, color: "#EAB308" },
                    { icon: Laugh, label: "Shumë Mirë", value: 4, color: "#10B981" },
                    { icon: Star, label: "Perfekt", value: 5, color: "#3B82F6" },
                    ].map((item) => (
                    <TouchableOpacity
                        key={item.value}
                        onPress={() => setSelectedRating(item.value)}
                        className={`items-center flex-1 ${
                        selectedRating === item.value ? "opacity-100" : "opacity-60"
                        }`}
                    >
                        <item.icon size={32} color={item.color} />
                        <Text className="text-xs mt-1 text-gray-700 font-pregular text-center">{item.label}</Text>
                    </TouchableOpacity>
                    ))}
                </View>

                <View className='mb-3'>
                    <TextField 
                        title='Me shume informata/opsionale'
                        placeholder='Ketu mund te shkruani informata rreth vleresimit...'
                        value={reviewDescription}
                        onChangeText={(e) => setReviewDescription(e)}
                        multiline
                    />
                </View>

                <View className='mb-2'>
                    <Text className='text-xs font-pregular text-indigo-950'>
                        Ju jeni duke vleresuar shoferin <Text className='text-indigo-600 font-psemibold'>{ride.driver.fullName}</Text>
                        {" "}me nivelin e vleresimit <Text className='text-red-600 font-psemibold'>{selectedRating}</Text> {reviewDescription && "dhe me pershkrim te vleresimit"}
                    </Text>
                </View>
                <View className="flex-row justify-between">
                    <TouchableOpacity
                    onPress={submitReview}
                    className="px-4 py-1.5 rounded-lg flex-row mb-2 items-center flex-1 justify-center gap-1 bg-indigo-600"
                    >
                    <Text className="text-white font-pregular">Vlereso shoferin</Text>
                    <Star color={"white"} size={18} />
                    </TouchableOpacity>
                </View>

                {/* Buttons */}
                <View className="flex-row justify-between">
                    <TouchableOpacity
                    onPress={() => setRate2Modal(false)}
                    className="px-4 py-1.5 rounded-lg flex-row items-center flex-1 justify-center gap-1 bg-red-600"
                    >
                    <Text className="text-white font-pregular">Mbyll</Text>
                    <X color={"white"} size={18} />
                    </TouchableOpacity>
                </View>
                </KeyboardAwareScrollView>
            </View>
        </View>
      </Modal>
    </>
  )
}

export default memo(RateNowModals)