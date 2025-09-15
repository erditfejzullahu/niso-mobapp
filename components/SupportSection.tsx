import { contactSupportSchema } from '@/schemas/contactSupportSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import * as ImagePicker from "expo-image-picker"
import { Send, Upload, X } from 'lucide-react-native'
import React, { useCallback, useMemo } from 'react'
import { Controller, useForm } from "react-hook-form"
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { z } from 'zod'
import TextField from './TextField'
import MoreAttachsLeft from './system/MoreAttachsLeft'
import Toast from 'react-native-toast-message'
import api from '@/hooks/useApi'


type contactSupportType = z.infer<typeof contactSupportSchema>;

const SupportSection = () => {
    const {control, reset, setValue,  formState: {errors, isSubmitting}, handleSubmit} = useForm<contactSupportType>({
        resolver: zodResolver(contactSupportSchema),
        defaultValues: useMemo(() => ({
            message: "",
            attachments: [],
            subject: ""
        }), []),
        mode: "onChange"
    })

    const pickImage = useCallback(async (onChange: (value: string[]) => void) => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== "granted"){
            alert("Na vjen keq, na duhen leje të kamerës që kjo të funksionojë!")
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            // allowsEditing: true,
            aspect: [4,3],
            quality: 0,
            allowsMultipleSelection: true
        })

        if(!result.canceled){
            onChange(result.assets.map(item => item.uri))
        }
    }, [reset])

    const submitTicket = useCallback(async (data: contactSupportType) => {
        try {
            const formData = new FormData();
            formData.append('content', data.message);
            formData.append('subject', data.subject);
            
            data.attachments.map(item => {
                const fileName = item.split('/').pop() || 'id_back.jpg';
                const fileNameMatch = /\.(\w+)$/.exec(fileName);
                const idBackType = fileNameMatch ? `image/${fileNameMatch[1]}` : 'image/jpeg';

                formData.append('evidences', {
                    uri: item,
                    name: fileName,
                    type: idBackType
                } as any);
            })

            const res = await api.post('/conversations/initiate-support-ticket', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if(res.data.success){
                Toast.show({
                    type: "success",
                    text1: "Sukses",
                    text2: "Sapo keni krijuar nje tikete ndihme. Klikoni per ridrejtim.",
                    onPress: () => {
                        //TODO: router to specific conversation
                    }
                })
                //TODO: invalidate conversations query.
            }
        } catch (error: any) {
            console.error(error);
            Toast.show({
                type: "error",
                text1: "Gabim",
                text2: error.response.data.message || "Dicka shkoi gabim ne server"
            })
        }
    }, [reset])


  return (
    <View className='gap-4'>
        <View>
            <Controller 
                control={control}
                name="subject"
                render={({field}) => (
                    <TextField 
                        title='Subjekti juaj'
                        onChange={field.onChange}
                        value={field.value}
                        placeholder='Nje titull mbi rastin...'
                    />
                )}
                />
                {errors.subject && (
                    <Text className="text-xs mt-1 text-red-500 font-plight">{errors.subject.message}</Text>   
                )}
        </View>
        <View>
            <Controller 
                control={control}
                name="message"
                render={({field}) => (
                    <TextField 
                        title='Mesazhi juaj'
                        onChange={field.onChange}
                        value={field.value}
                        placeholder='Përshkruani rastin tuaj...'
                    />
                )}
                />
                {errors.message && (
                    <Text className="text-xs mt-1 text-red-500 font-plight">{errors.message.message}</Text>   
                )}
        </View>
        <View>
            <Controller 
                control={control}
                name="attachments"
                render={({field}) => (
                    <>
                        <Text className='text-gray-700 mb-1 font-pmedium'>Imazhe<Text className='text-xs'>(opsionale)</Text></Text>
                        <TouchableOpacity className='flex-row gap-2 rounded-xl py-3 bg-indigo-600 items-center flex-1 justify-center' onPress={() => pickImage(field.onChange)}>
                            <Text className='text-white text-sm font-pregular'>{field.value ? "Ndryshoni Imazhet" : "Ngarkoni Imazhe"}</Text>
                            <Upload color={"white"} size={18}/>
                        </TouchableOpacity>
                        {field.value && field.value.length > 0 && (
                            <View className='relative mt-2'>
                                <View className='flex-row gap-1'>
                                {field.value.slice(0,2).map((image, idx) => (
                                    <View key={idx} className='self-start'>
                                        <TouchableOpacity onPress={() => setValue("attachments", field.value.filter((_, index) => index !== idx))} className='absolute -right-1 -top-1 bg-indigo-600 rounded-full z-50 p-1'><X color={"white"} size={20}/></TouchableOpacity>
                                        <Image 
                                            source={{uri: image}}
                                            style={{height: 200, minWidth: "50%"}}
                                            resizeMode='cover'
                                            className='rounded-xl'
                                        />
                                        {/* TODO: ADD IMAGE OPENER FULLSCREEN WITH ITS LENGTH */}
                                    </View>
                                ))}
                                </View>
                                {field.value.length > 0 && (
                                    <MoreAttachsLeft length={field.value.length - 2} onPress={() => {}} contStyle={"m-auto"}/>    
                                )}
                            </View>
                        )}
                    </>
                )}
            />
        </View>
        <View>
            <TouchableOpacity onPress={handleSubmit(submitTicket)} disabled={isSubmitting} className='bg-indigo-950 flex-row gap-2 py-3 flex-1 items-center justify-center rounded-xl'>
                <Text className='text-white  text-sm font-pregular'>{isSubmitting ? "Duke u kryer veprimi..." : "Kërkoni ndihmë"}</Text>
                <Send color={"white"} size={18}/>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default SupportSection