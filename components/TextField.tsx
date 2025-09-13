import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

const TextField = ({ value, placeholder, enabled = true, className = "", title, ...props}: {value: string; enabled?: boolean; placeholder: string; className?: string | null; title: string} & TextInputProps) => {
  return (
    <View>
        <Text className="mb-1 text-gray-700 font-pmedium text-sm">{title}</Text>
        <TextInput
            editable={enabled}
            placeholder={placeholder}
            className={`bg-white rounded-2xl font-pregular px-4 py-3 shadow-sm shadow-black/10 border border-gray-200 ${className}`}
            value={value}
            {...props}
        />
    </View>
  )
}

export default TextField