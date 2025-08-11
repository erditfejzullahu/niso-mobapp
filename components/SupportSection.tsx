import { contactSupportSchema } from '@/schemas/contactSupportSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import * as ImagePicker from "expo-image-picker"
import { Send, Upload, X } from 'lucide-react-native'
import React, { useMemo } from 'react'
import { Controller, useForm } from "react-hook-form"
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { z } from 'zod'
import TextField from './TextField'


type contactSupportType = z.infer<typeof contactSupportSchema>;

const SupportSection = () => {
    const {control, reset, setValue,  formState: {errors, isSubmitting}, handleSubmit} = useForm<contactSupportType>({
        resolver: zodResolver(contactSupportSchema),
        defaultValues: useMemo(() => ({
            message: "",
            imageOrVideo: null
        }), []),
        mode: "onChange"
    })

    const onSubmit = async (data: contactSupportType) => {
        try {
            
        } catch (error) {
            console.error(error);
        }
    }

    const pickImage = async (onChange: (value: string) => void) => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== "granted"){
            alert("Na vjen keq, na duhen leje të kamerës që kjo të funksionojë!")
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4,3],
            quality: 0
        })

        if(!result.canceled){
            onChange(result.assets[0].uri)
        }
    }


  return (
    <View className='gap-4'>
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
                name="imageOrVideo"
                render={({field}) => (
                    <>
                        <Text className='text-gray-700 mb-1 font-pmedium'>Imazh/Video<Text className='text-xs'>(opsional)</Text></Text>
                        <TouchableOpacity className='flex-row gap-2 rounded-xl py-3 bg-indigo-600 items-center flex-1 justify-center' onPress={() => pickImage(field.onChange)}>
                            <Text className='text-white text-sm font-pregular'>{field.value ? "Ndryshoni Imazhin/Videon" : "Ngarkoni Imazhin/Videon"}</Text>
                            <Upload color={"white"} size={18}/>
                        </TouchableOpacity>
                        {field.value && (
                            <View className='relative mt-2'>
                                <TouchableOpacity onPress={() => setValue("imageOrVideo", null)} className='absolute -right-1 -top-1 bg-indigo-600 rounded-full z-50 p-1'><X color={"white"} size={20}/></TouchableOpacity>
                                <Image 
                                    source={{uri: field.value}}
                                    style={{height: 200}}
                                    className='rounded-xl'
                                />
                            </View>
                        )}
                    </>
                )}
            />
        </View>
        <View>
            <TouchableOpacity disabled={isSubmitting} className='bg-indigo-950 flex-row gap-2 py-3 flex-1 items-center justify-center rounded-xl'>
                <Text className='text-white  text-sm font-pregular'>{isSubmitting ? "Duke u kryer veprimi..." : "Kërkoni ndihmë"}</Text>
                <Send color={"white"} size={18}/>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default SupportSection