import HeaderComponent from '@/components/HeaderComponent';
import RegularClientCard from '@/components/RegularClientCard';
import SearchBar from '@/components/SearchBar';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

export const regularClients = [
  {
    id: "1",
    name: "Arben Hoxha",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    ridesCount: 24,
    averageRating: 4.9,
    lastRideDate: "2025-08-08T14:22:00Z",
    mainPickup: "Rruga Dëshmorët e Kombit, Tiranë",
    note: "Preferon sediljen e përparme",
  },
  {
    id: "2",
    name: "Elda Kola",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    ridesCount: 15,
    averageRating: 4.8,
    lastRideDate: "2025-08-07T09:45:00Z",
    mainPickup: "Rruga e Elbasanit, Tiranë",
    note: "Paguan gjithmonë në dorë",
  },
  {
    id: "3",
    name: "Gentian Pasha",
    photo: "https://randomuser.me/api/portraits/men/21.jpg",
    ridesCount: 30,
    averageRating: 5.0,
    lastRideDate: "2025-08-06T18:05:00Z",
    mainPickup: "Rruga e Kavajës, Tiranë",
  },
];

const RegularClients = () => {

  const [filteredClients, setFilteredClients] = useState(regularClients);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredClients(regularClients);
      return;
    }

    const filtered = regularClients.filter(client =>
      client.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  return (
    <View className='flex-1 bg-gray-50'>
      <FlatList 
        data={regularClients}
        className='p-4 mb-20'
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <RegularClientCard 
            name={item.name}
            photo={item.photo}
            ridesCount={item.ridesCount}
            averageRating={item.averageRating}
            lastRideDate={item.lastRideDate}
            mainPickup={item.mainPickup}
            note={item.note}
          />
        )}
        ListHeaderComponent={() => (
          <View className='mb-4'>
            <HeaderComponent
              title='Klientë të rregullt'
              subtitle="Këtu keni listën e klientëve të rregullt me të cilët mund të kontaktoni rregullisht"
            />
            <View className='mt-4'>
            <SearchBar onSearch={handleSearch}/>
            </View>
          </View>
        )}
      />
    </View>
  )
}

export default RegularClients