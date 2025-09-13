import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react';
import { X, Download, Share2, Calendar, Search } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DateTimePicker from "@react-native-community/datetimepicker";
import { FinancialReceiptItemInterface, User } from '@/types/app-types';
import { useQuery } from '@tanstack/react-query';
import api from '@/hooks/useApi';
import LoadingState from './system/LoadingState';
import ErrorState from './system/ErrorState';
import EmptyState from './system/EmptyState';
import FinancialReceiptItem from './FinancialReceiptItem';
import dayjs from 'dayjs';

const mockTransactions = [
  { id: '1', date: '2025-09-01', description: 'ajsdiasjdiasjd129388923jrasj', debit: 3.5, credit: 0, balance: 996.5 },
  { id: '2', date: '2025-09-03', description: 'Salary', debit: 0, credit: 1200, balance: 2196.5 },
  { id: '3', date: '2025-09-05', description: 'Electric Bill', debit: 75, credit: 0, balance: 2121.5 },
];

const FinancialReceipt = ({
    user,
  open,
  setOpen,
}: {
    user: User;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  
  
const [showFromDate, setShowFromDate] = useState(false)
const [showToDate, setShowToDate] = useState(false)

const [fromDate, setFromDate] = useState<Date>(new Date());
const [toDate, setToDate] = useState<Date>(new Date());

const [makeReq, setMakeReq] = useState(false)

    const formatDate = useCallback((date: any) => {
        if (!date) return 'N/A';
        return dayjs(date).format('YYYY-MM-DD');
    }, []);

  const handleDownload = async () => {
    // const fileUri = await generateCSV();
    // alert(`File saved at: ${fileUri}`);
  };

  const handleShare = async () => {
    // const fileUri = await generateCSV();
    // await Sharing.shareAsync(fileUri);
  };


  useEffect(() => {
    if(toDate < fromDate){
        setFromDate(toDate)
    }
  }, [toDate, fromDate])

  const {data, isLoading, isRefetching, error, refetch} = useQuery({
    queryKey: ['financialMirror', fromDate, toDate],
    queryFn: async () => {
        const res = await api.get<FinancialReceiptItemInterface[]>('/finances/financial-mirror', {params: {fromDate, toDate}});
        return res.data
    },
    enabled: makeReq,
    refetchOnWindowFocus: false
  })
  
  console.log(data);
  

  return (
    <>
      <Modal
        visible={open}
        onRequestClose={() => setOpen(false)}
        animationType="slide"
        transparent
      >
        <View className="flex-1 bg-black/40 justify-center items-center w-full">
          <View className="bg-white rounded-2xl p-5 w-full mt-auto max-h-[85%]">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-psemibold text-indigo-950">
                Pasqyra Financiare
              </Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <X color={'#4f46e5'} />
              </TouchableOpacity>
            </View>

            {/* Date Pickers */}
            <View className="flex-row justify-between mb-3">
              <TouchableOpacity
                className="flex-row items-center bg-indigo-50 px-3 py-2 rounded-lg flex-1 mr-2"
                onPress={() => setShowFromDate(true)}
              >
                <Calendar color="#4f46e5" size={18} />
                <Text className="ml-2 text-indigo-900">
                  {"Nga: " + formatDate(fromDate)} 
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center bg-indigo-50 px-3 py-2 rounded-lg flex-1 ml-2"
                onPress={() => setShowToDate(true)}
              >
                <Calendar color="#4f46e5" size={18} />
                <Text className="ml-2 text-indigo-900">
                  {"Deri: " + formatDate(toDate)} 
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity disabled={isLoading || isRefetching} className='bg-indigo-600 mb-3 flex-row py-2 items-center gap-2 justify-center rounded-lg' onPress={() => setMakeReq(true)}>
                <Search color={"#fff"} size={14}/>
                <Text className='text-white font-pmedium text-sm'>{(isLoading || isRefetching) ? "Duke u ngarkuar..." : "Kerkoni pasqyren e llogarise"}</Text>
            </TouchableOpacity>

            {/* Transaction List */}
            {makeReq && (
                (isLoading || isRefetching) ? (
                    <LoadingState />
                ) : (!isLoading && !isRefetching) && error ? (
                    <ErrorState onRetry={refetch}/>
                ) : (
                    <FlatList
                      data={data}
                      keyExtractor={(item) => item.id}
                      className="mb-4"
                      renderItem={({ item }) => (
                        <FinancialReceiptItem item={item} user={user}/>
                      )}
                      ListEmptyComponent={() => (
                        <EmptyState 
                            containerStyle='!bg-white'
                            message={`Nuk u gjeten te dhena me datat ${formatDate(fromDate)} deri me ${formatDate(toDate)}. Nese mendoni qe eshte gabim, provoni perseri.`}
                            textStyle='!font-pregular !text-sm'
                            onRetry={refetch}
                        />
                      )}
                    />
                )
            )}

            {/* Summary */}
            <View className="mt-3 p-3 bg-indigo-50 rounded-xl">
              <Text className="text-sm text-indigo-950 font-psemibold">
                Totali i {user.role === "DRIVER" ? "fituar" : "shpenzuar"}: <Text className='text-indigo-600 font-pbold'>{mockTransactions[mockTransactions.length - 1].balance} € </Text>
              </Text>
            </View>

            {/* Actions */}
            <View className="flex-row justify-around mt-5">
              <TouchableOpacity
                className="flex-row items-center bg-indigo-600 px-4 py-2 rounded-xl"
                onPress={handleDownload}
              >
                <Download color="white" size={18} />
                <Text className="text-white ml-2 font-pregular">Shkarko</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center bg-green-600 px-4 py-2 rounded-xl"
                onPress={handleShare}
              >
                <Share2 color="white" size={18} />
                <Text className="text-white ml-2 font-pregular">Ndaj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      {showFromDate && (
        <View className='absolute justify-end items-center border w-full h-full m-auto'>
            <View className='bg-indigo-50 rounded-2xl p-4 items-center justify-center w-[95%]'>
                <View className='flex-row items-center gap-1'>
                    <Text className='text-sm text-center flex-1 font-psemibold text-indigo-600'>Zgjidhni prej kur e deshironi pasqyren financiare</Text>
                    <TouchableOpacity onPress={() => setShowFromDate(false)}>
                        <X color={"#4f46e5"}/>
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    value={fromDate || new Date()}
                    mode="date"
                    locale='sq-AL'
                    display="inline"
                    maximumDate={toDate || new Date()}
                    onChange={(_, selectedDate) => {
                    setShowFromDate(false);
                    if (selectedDate) setFromDate(selectedDate);
                    }}
                />
            </View>
        </View>
      )}

      {showToDate && (
        <View className='absolute justify-end items-center border w-full h-full m-auto'>
            <View className='bg-indigo-50 rounded-2xl p-4 items-center justify-center w-[95%]'>
                <View className='flex-row items-center gap-1'>
                    <Text className='text-sm flex-1 text-center font-psemibold text-indigo-600'>Zgjidhni deri kur e deshironi pasqyren financiare</Text>
                    <TouchableOpacity onPress={() => setShowToDate(false)}>
                        <X color={"#4f46e5"}/>
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    value={toDate || new Date()}
                    mode="date"
                    locale='sq-AL'
                    display="inline"
                    maximumDate={new Date()}
                    onChange={(_, selectedDate) => {
                    setShowToDate(false);
                    if (selectedDate) setToDate(selectedDate);
                    }}
                />
            </View>
        </View>
      )}
      </Modal>
    </>
  );
};

export default memo(FinancialReceipt);
