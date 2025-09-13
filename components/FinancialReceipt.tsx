import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import React, { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { X, Download, Share2, Calendar } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DateTimePicker from "@react-native-community/datetimepicker";
import { User } from '@/types/app-types';

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

  const formatDate = (date: Date) => date.toISOString().split('T')[0]; // YYYY-MM-DD

  const generateCSV = async () => {
    let csv = 'Date,Description,Debit,Credit,Balance\n';
    mockTransactions.forEach((t) => {
      csv += `${t.date},${t.description},${t.debit},${t.credit},${t.balance}\n`;
    });

    const fileUri = FileSystem.documentDirectory + 'financial_receipt.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return fileUri;
  };

  const handleDownload = async () => {
    const fileUri = await generateCSV();
    alert(`File saved at: ${fileUri}`);
  };

  const handleShare = async () => {
    const fileUri = await generateCSV();
    await Sharing.shareAsync(fileUri);
  };

  useEffect(() => {
    if(toDate < fromDate){
        setFromDate(toDate)
    }
  }, [toDate, fromDate])
  


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
            <View className="flex-row justify-between mb-4">
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

            {/* Transaction List */}
            <FlatList
              data={mockTransactions}
              keyExtractor={(item) => item.id}
              className="mb-4"
              renderItem={({ item }) => (
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-xs font-plight w-[20%]">{item.date}</Text>
                  <Text className="text-xs flex-1 font-pregular" numberOfLines={1}>{item.description}</Text>
                  <Text className="text-xs font-pregular w-[15%] text-red-500">
                    {item.debit ? `- ${item.debit}` : ''}
                  </Text>
                  <Text className="text-xs w-[15%] font-pregular text-green-600">
                    {item.credit ? `+ ${item.credit}` : ''}
                  </Text>

                  {/* it can be expense refund */}
                  <Text className="text-xs w-[20%] font-psemibold text-right">
                    Shpenzim 
                  </Text>

                </View>
              )}
            />

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
