import { Search, X } from "lucide-react-native";
import React, { memo, useMemo, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import Animated, { Easing, FadeInLeft } from "react-native-reanimated";
import { debounce } from "lodash";

type SearchBarProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
};

export default memo(function SearchBar({ placeholder = "Kërko klientin...", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const debounceTextSearch = useMemo(
    () => debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 500),
    [onSearch]
  )

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
        onChangeText={(e) => {debounceTextSearch(e); setQuery(e);}}
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
})
