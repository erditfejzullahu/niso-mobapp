import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { memo, useState } from 'react'
import { toFixedNoRound } from '@/utils/toFixed'
import { PassengerAllExpensesList } from '@/types/app-types'
import dayjs from "dayjs";
import { X, Car, MapPin, Calendar, Clock, DollarSign, TrendingUp, User, CheckCircle, Clock as ClockIcon, AlertCircle } from 'lucide-react-native';

const PassengerFinancialItemCard = ({item}: {item: PassengerAllExpensesList}) => {
    const [openModal, setOpenModal] = useState(false)

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle size={20} color="#10b981" />;
            case 'PENDING':
                return <ClockIcon size={20} color="#f59e0b" />;
            case 'CANCELLED':
            case 'REFUNDED':
                return <AlertCircle size={20} color="#ef4444" />;
            default:
                return <ClockIcon size={20} color="#6b7280" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'text-green-600';
            case 'PENDING':
                return 'text-yellow-600';
            case 'CANCELLED':
            case 'REFUNDED':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'I përfunduar';
            case 'PENDING':
                return 'Në pritje';
            case 'CANCELLED':
                return 'Anuluar';
            case 'REFUNDED':
                return 'Rikthyer';
            case 'PAID':
                return "I Paguar";
            default:
                return status;
        }
    };

    return (
        <>
            <TouchableOpacity onPress={() => setOpenModal(true)}>
                <View className="flex-row justify-between bg-white rounded-xl p-4 mb-2 shadow-sm shadow-black/10 border border-gray-100">
                    <Text className="text-gray-600 font-pmedium">
                        {dayjs(item.paidAt || item.createdAt).format("DD MMM YYYY")}
                    </Text>
                    <Text className="text-indigo-900 font-psemibold">
                        {toFixedNoRound(item.amount, 2)} €
                    </Text>
                </View>
            </TouchableOpacity>

            <Modal
                visible={openModal}
                transparent
                animationType="slide"
                onRequestClose={() => setOpenModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View style={{maxHeight: "90%", height: "100%"}} className="bg-white rounded-t-2xl p-5 shadow-lg shadow-black/30">
                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-psemibold text-indigo-900">
                                Detajet e Pagesës
                            </Text>
                            <TouchableOpacity 
                                onPress={() => setOpenModal(false)}
                                className="p-2 rounded-full bg-gray-100"
                            >
                                <X size={20} color="#4338ca" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                            {/* Amount and Status */}
                            <View className="bg-indigo-50 rounded-xl p-4 mb-4">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-2xl font-psemibold text-indigo-900">
                                        {toFixedNoRound(item.totalPaid, 2)} €
                                    </Text>
                                    <View className="flex-row items-center">
                                        {getStatusIcon(item.status)}
                                        <Text className={`ml-2 font-pmedium ${getStatusColor(item.status)}`}>
                                            {getStatusText(item.status)}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-gray-600 text-sm">
                                    Shuma totale e pagesës/shpenzimit tuaj
                                </Text>
                            </View>

                            {/* Earnings Breakdown */}
                            <View className="bg-gray-50 rounded-xl p-4 mb-4">
                                <Text className="font-psemibold text-gray-800 mb-3">Detajet financiare</Text>
                                
                                <View className="flex-row justify-between items-center mb-2">
                                    <View className="flex-row items-center">
                                        <DollarSign size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Shuma bruto:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {toFixedNoRound(item.amount, 2)} €
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center mb-2">
                                    <View className="flex-row items-center">
                                        <TrendingUp size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Tarifa e platformës:</Text>
                                    </View>
                                    <Text className="font-pmedium text-red-600">
                                        -{toFixedNoRound(item.surcharge, 2)} €
                                    </Text>
                                </View>

                                <View className="h-px bg-gray-200 my-2" />

                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <DollarSign size={16} color="#4338ca" />
                                        <Text className="ml-2 font-psemibold text-gray-800">Shpenzimi neto:</Text>
                                    </View>
                                    <Text className="font-psemibold text-green-600">
                                        {toFixedNoRound(item.totalPaid, 2)} €
                                    </Text>
                                </View>
                            </View>

                            {/* Ride Information */}
                            <View className="bg-gray-50 rounded-xl p-4 mb-4">
                                <Text className="font-psemibold text-gray-800 mb-3">Informacione për udhëtimin</Text>
                                
                                <View className="flex-row items-start mb-3">
                                    <Car size={16} color="#4338ca" className="mt-1" />
                                    <View className="ml-2 flex-1">
                                        <Text className="text-gray-600">Udhëtimi ID:</Text>
                                        <Text selectable={true} className="font-pmedium text-xs text-gray-800">
                                            #{item.ride.id}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-start mb-3">
                                    <MapPin size={16} color="#4338ca" className="mt-1" />
                                    <View className="ml-2 flex-1">
                                        <Text className="text-gray-600">Nga:</Text>
                                        <Text className="font-pmedium text-gray-800">
                                            {item.ride.rideRequest.fromAddress}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-start mb-3">
                                    <MapPin size={16} color="#4338ca" className="mt-1" />
                                    <View className="ml-2 flex-1">
                                        <Text className="text-gray-600">Deri:</Text>
                                        <Text className="font-pmedium text-gray-800">
                                            {item.ride.rideRequest.toAddress}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <TrendingUp size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Distanca:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {toFixedNoRound(item.ride.rideRequest.distanceKm, 2)} km
                                    </Text>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-600">Udhëtim urgjent:</Text>
                                    <Text className="font-pmedium text-gray-800">
                                        {item.ride.rideRequest.isUrgent ? 'Po' : 'Jo'}
                                    </Text>
                                </View>
                            </View>

                            {/* Passenger Information */}
                            <View className="bg-gray-50 rounded-xl p-4 mb-4">
                                <Text className="font-psemibold text-gray-800 mb-3">Informacione për shoferin</Text>
                                
                                <View className="flex-row items-center mb-2">
                                    <User size={16} color="#4338ca" />
                                    <Text className="ml-2 text-gray-600">Emri:</Text>
                                    <Text className="ml-2 font-pmedium text-gray-800">
                                        {item.ride.driver.fullName}
                                    </Text>
                                </View>
                            </View>

                            {/* Dates Information */}
                            <View className="bg-gray-50 rounded-xl p-4">
                                <Text className="font-psemibold text-gray-800 mb-3">Data dhe koha</Text>
                                
                                <View className="flex-row justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <Calendar size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Data e pagesës:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {item.paidAt 
                                            ? dayjs(item.paidAt).format("DD MMM YYYY")
                                            : 'N/A'
                                        }
                                    </Text>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <Clock size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Krijuar më:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {dayjs(item.createdAt).format("DD MMM YYYY HH:mm")}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between">
                                    <View className="flex-row items-center">
                                        <Clock size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Përditësuar më:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {dayjs(item.ride.updatedAt).format("DD MMM YYYY HH:mm")}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setOpenModal(false)}
                            className="px-4 py-3 rounded-xl bg-indigo-600"
                        >
                            <Text className="text-white font-pmedium text-center">Mbyll</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default memo(PassengerFinancialItemCard)