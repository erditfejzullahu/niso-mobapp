import React from 'react';
import { Text, TextInput, View } from 'react-native';

const TextField = ({value, onChange, placeholder, enabled = true, className = "", title}: {value: string; onChange: (text: string) => void; enabled?: boolean; placeholder: string; className?: string | null; title: string}) => {
  return (
    <View>
        <Text className="mb-1 text-gray-700 font-pmedium">{title}</Text>
        <TextInput
            editable={enabled}
            placeholder={placeholder}
            className={`bg-white rounded-2xl px-4 py-3 shadow-sm shadow-black/10 border border-gray-200 ${className}`}
            value={value}
            onChangeText={onChange}
        />
    </View>
  )
}

export default TextField