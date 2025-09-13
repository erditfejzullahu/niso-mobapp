import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, { memo, useCallback, useState } from 'react'
import { DriverAllPayoutsList, FinancialReceiptItemInterface, PassengerAllExpensesList, User as UserType } from '@/types/app-types'
import { toFixedNoRound } from '@/utils/toFixed';
import { AlertCircle, Calendar, Car, CheckCircle, Clock, ClockIcon, DollarSign, Download, MapPin, TrendingUp, User, X } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import api from '@/hooks/useApi';
import LoadingState from './system/LoadingState';
import ErrorState from './system/ErrorState';
import EmptyState from './system/EmptyState';
import dayjs from 'dayjs';

const FinancialReceiptItem = ({item, user}: {item: FinancialReceiptItemInterface; user: UserType}) => {
    console.log(item,  "  item");
    
    const [openModal, setOpenModal] = useState(false)
    const formatDate = useCallback((date: any) => {
        if (!date) return 'N/A';
        return dayjs(date).format('YYYY-MM-DD');
    }, []);

    const getStatusIcon = useCallback((status: string) => {
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
    }, []);

    const getStatusColor = useCallback((status: string) => {
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
    }, []);

    const getStatusText = useCallback((status: string) => {
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
    }, []);


    type FinanceTogetherListType = DriverAllPayoutsList & PassengerAllExpensesList

    const { data, isLoading, isRefetching, refetch, error } = useQuery({
        queryKey: ['financialItem', item.id, user.role], // include role in cache key
        queryFn: async () => {    
            const res = await api.get<FinanceTogetherListType>(`/finances/get-fin-detail/${item.id}`);
            return res.data;
        },
        enabled: openModal,
        refetchOnWindowFocus: false,
        retry: 2
    });


  return (
    <>
        <TouchableOpacity onPress={() => setOpenModal(true)} className="flex-row justify-between py-2 border-b border-gray-200">
            <Text className="text-xs font-plight w-[20%] text-indigo-950">{formatDate(item.dateProcessed)}</Text>
            <Text className="text-xs flex-1 font-pregular text-indigo-950" numberOfLines={1}>{item.id}</Text>
            {item.status === "PAID" && <Text className={`text-xs mx-2 font-pregular w-[15%] ${user.role === "DRIVER" ? "text-green-500" : "text-red-500"} `}>{user.role === "DRIVER" ? "+" : "-"} {item.paid}€</Text>}
            {item.status === "PENDING" && <Text className={`text-xs mx-2 font-pregular w-[15%] text-gray-500`}>{user.role === "DRIVER" ? "+" : "-"} {item.paid}€</Text>}
            {item.status === "REFUNDED" && <Text className={`text-xs mx-2 font-pregular w-[15%] ${user.role === "DRIVER" ? "text-red-500" : "text-green-500"}`}>
                {user.role === "DRIVER" ? "- " + item.paid + "€" : "+ " + item.paid + "€"}    
            </Text>}

            {/* it can be expense refund */}
            <Text className="text-xs w-[20%] font-psemibold text-right text-indigo-950">
                {(item.status === "PAID" && user.role === "DRIVER") ? "Fitim" : (item.status === "PAID" && user.role === "PASSENGER") ? "Shpenzim" : item.status === "REFUNDED" ? "Kthim i €" : item.status === "PENDING" ? "Ne pritje" : "Tjeter"} 
            </Text>
        </TouchableOpacity>

        {user.role === "DRIVER" && data && (
            <Modal
                visible={openModal}
                transparent
                animationType="slide"
                onRequestClose={() => setOpenModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    {/* {(isLoading || isRefetching) ? (
                        <View className='bg-white p-4 h-[300px]'>
                            <LoadingState />
                        </View>
                    ) : ((!isLoading && !isRefetching) && error) ? (   
                        <View className='bg-white p-4 h-[300px]'>
                            <ErrorState message={`${error.message}`} onRetry={refetch}/>
                        </View>
                    ) : !data ? (
                        <EmptyState message='Nuk u gjet gjendja financore e kerkeses tuaj. Ju lutem provoni perseri!' textStyle='!font-plight !text-sm' onRetry={refetch}/>
                    ) : ( */}
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
                                        {toFixedNoRound(data.netEarnings, 2)} €
                                    </Text>
                                    <View className="flex-row items-center">
                                        {getStatusIcon(data.status)}
                                        <Text className={`ml-2 font-pmedium ${getStatusColor(data.status)}`}>
                                            {getStatusText(data.status)}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-gray-600 text-sm">
                                    Shuma totale e pagesës
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
                                        {toFixedNoRound(data.amount, 2)} €
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center mb-2">
                                    <View className="flex-row items-center">
                                        <TrendingUp size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Tarifa e platformës:</Text>
                                    </View>
                                    <Text className="font-pmedium text-red-600">
                                        -{toFixedNoRound(data.fee, 2)} €
                                    </Text>
                                </View>

                                <View className="h-px bg-gray-200 my-2" />

                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <DollarSign size={16} color="#4338ca" />
                                        <Text className="ml-2 font-psemibold text-gray-800">Fitimi neto:</Text>
                                    </View>
                                    <Text className="font-psemibold text-green-600">
                                        {toFixedNoRound(data.netEarnings, 2)} €
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
                                            #{data.ride.id}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-start mb-3">
                                    <MapPin size={16} color="#4338ca" className="mt-1" />
                                    <View className="ml-2 flex-1">
                                        <Text className="text-gray-600">Nga:</Text>
                                        <Text className="font-pmedium text-gray-800">
                                            {data.ride.rideRequest.fromAddress}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-start mb-3">
                                    <MapPin size={16} color="#4338ca" className="mt-1" />
                                    <View className="ml-2 flex-1">
                                        <Text className="text-gray-600">Deri:</Text>
                                        <Text className="font-pmedium text-gray-800">
                                            {data.ride.rideRequest.toAddress}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <TrendingUp size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Distanca:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {toFixedNoRound(data.ride.rideRequest.distanceKm, 2)} km
                                    </Text>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-600">Udhëtim urgjent:</Text>
                                    <Text className="font-pmedium text-gray-800">
                                        {data.ride.rideRequest.isUrgent ? 'Po' : 'Jo'}
                                    </Text>
                                </View>
                            </View>

                            {/* Passenger Information */}
                            <View className="bg-gray-50 rounded-xl p-4 mb-4">
                                <Text className="font-psemibold text-gray-800 mb-3">Informacione për pasagjerin</Text>
                                
                                <View className="flex-row items-center mb-2">
                                    <User size={16} color="#4338ca" />
                                    <Text className="ml-2 text-gray-600">Emri:</Text>
                                    <Text className="ml-2 font-pmedium text-gray-800">
                                        {data.ride.passenger.fullName}
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
                                        {data.paymentDate 
                                            ? dayjs(data.paymentDate).format("DD MMM YYYY")
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
                                        {dayjs(data.createdAt).format("DD MMM YYYY HH:mm")}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between">
                                    <View className="flex-row items-center">
                                        <Clock size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Përditësuar më:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {dayjs(data.ride.updatedAt).format("DD MMM YYYY HH:mm")}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity className="bg-indigo-900 mt-3 gap-2 justify-center flex-row items-center rounded-xl p-4">
                                <Text className='font-psemibold text-white'>Shkarko dokumentin</Text>
                                <Download color={"#fff"}/>
                            </TouchableOpacity>
                        </ScrollView>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setOpenModal(false)}
                            className="px-4 py-3 rounded-xl bg-indigo-600"
                        >
                            <Text className="text-white font-pmedium text-center">Mbyll</Text>
                        </TouchableOpacity>
                    </View>
                    {/* )} */}
                </View>
            </Modal>
        )}

        {user.role === "PASSENGER" && data && (
            <Modal
                visible={openModal}
                transparent
                animationType="slide"
                onRequestClose={() => setOpenModal(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    {/* {(isLoading || isRefetching) ? (
                        <View className='bg-white p-4 h-[300px]'>
                            <LoadingState />
                        </View>
                    ) : ((!isLoading && !isRefetching) && error) ? (   
                        <View className='bg-white p-4 h-[300px]'>
                            <ErrorState message={`${error.message}`} onRetry={refetch}/>
                        </View>
                    ) : !data ? (
                        <EmptyState message='Nuk u gjet gjendja financore e kerkeses tuaj. Ju lutem provoni perseri!' textStyle='!font-plight !text-sm' onRetry={refetch}/>
                    ) : ( */}
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
                                        {toFixedNoRound(data.totalPaid, 2)} €
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
                                        {toFixedNoRound(data.amount, 2)} €
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center mb-2">
                                    <View className="flex-row items-center">
                                        <TrendingUp size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Tarifa e platformës:</Text>
                                    </View>
                                    <Text className="font-pmedium text-red-600">
                                        -{toFixedNoRound(data.surcharge, 2)} €
                                    </Text>
                                </View>

                                <View className="h-px bg-gray-200 my-2" />

                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <DollarSign size={16} color="#4338ca" />
                                        <Text className="ml-2 font-psemibold text-gray-800">Shpenzimi neto:</Text>
                                    </View>
                                    <Text className="font-psemibold text-green-600">
                                        {toFixedNoRound(data.totalPaid, 2)} €
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
                                            #{data.ride.id}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-start mb-3">
                                    <MapPin size={16} color="#4338ca" className="mt-1" />
                                    <View className="ml-2 flex-1">
                                        <Text className="text-gray-600">Nga:</Text>
                                        <Text className="font-pmedium text-gray-800">
                                            {data.ride.rideRequest.fromAddress}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-start mb-3">
                                    <MapPin size={16} color="#4338ca" className="mt-1" />
                                    <View className="ml-2 flex-1">
                                        <Text className="text-gray-600">Deri:</Text>
                                        <Text className="font-pmedium text-gray-800">
                                            {data.ride.rideRequest.toAddress}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                    <View className="flex-row items-center">
                                        <TrendingUp size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Distanca:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {toFixedNoRound(data.ride.rideRequest.distanceKm, 2)} km
                                    </Text>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-gray-600">Udhëtim urgjent:</Text>
                                    <Text className="font-pmedium text-gray-800">
                                        {data.ride.rideRequest.isUrgent ? 'Po' : 'Jo'}
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
                                        {data.ride.driver.fullName}
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
                                        {data.paidAt 
                                            ? dayjs(data.paidAt).format("DD MMM YYYY")
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
                                        {dayjs(data.createdAt).format("DD MMM YYYY HH:mm")}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between">
                                    <View className="flex-row items-center">
                                        <Clock size={16} color="#4338ca" />
                                        <Text className="ml-2 text-gray-600">Përditësuar më:</Text>
                                    </View>
                                    <Text className="font-pmedium text-gray-800">
                                        {dayjs(data.ride.updatedAt).format("DD MMM YYYY HH:mm")}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity className="bg-indigo-900 mt-3 gap-2 justify-center flex-row items-center rounded-xl p-4">
                                <Text className='font-psemibold text-white'>Shkarko dokumentin</Text>
                                <Download color={"#fff"}/>
                            </TouchableOpacity>
                        </ScrollView>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setOpenModal(false)}
                            className="px-4 py-3 rounded-xl bg-indigo-600"
                        >
                            <Text className="text-white font-pmedium text-center">Mbyll</Text>
                        </TouchableOpacity>
                    </View>
                    {/* )} */}
                </View>
            </Modal>
        )}
    </>
  )
}

export default memo(FinancialReceiptItem)