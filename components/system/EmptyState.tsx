// components/EmptyState.tsx
import React, { ClassAttributes } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onRetry?: () => void;
  retryButtonText?: string;
  textStyle?: string;
  containerStyle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = 'Nuk u gjeten te dhena', 
  icon = 'document-outline' ,
  retryButtonText = 'Provoni perseri',
  textStyle = "",
  containerStyle= "",
  onRetry
}) => {
  return (
    <View style={styles.container} className={`${containerStyle}`}>
      <View style={styles.content}>
        <Ionicons name={icon} size={48} color="#4f46e5" />
        <Text className={`font-pmedium ${textStyle}`} style={styles.message}>{message}</Text>
        {onRetry && (
            <TouchableOpacity
              style={styles.retryButton} 
              onPress={onRetry}
              activeOpacity={0.8}
              className='!bg-indigo-600 mt-4'
            >
              <Ionicons name="refresh" size={20} color="#ffffff" />
              <Text className='font-pmedium' style={styles.retryButtonText}>{retryButtonText}</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626', // red-600
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: '80%',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151', // gray-700
    textAlign: 'center',
  },
});

export default EmptyState;