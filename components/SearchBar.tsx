import { Search, X } from "lucide-react-native";
import React, { useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import Animated, { Easing, FadeInLeft } from "react-native-reanimated";

type SearchBarProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
};

export default function SearchBar({ placeholder = "Kërko klientin...", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <Animated.View entering={FadeInLeft.easing(Easing.bounce).duration(1000)} className="flex-row items-center bg-white rounded-xl px-4 py-2 shadow-md shadow-black/5">
      <Search size={20} color="#6366F1" />
      <TextInput
        className="flex-1 ml-3 text-gray-700 text-base font-pregular"
        placeholder={placeholder}
        value={query}
        onChangeText={handleChange}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={clearSearch} className="p-1 rounded-full">
          <X size={20} color="#6366F1" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
