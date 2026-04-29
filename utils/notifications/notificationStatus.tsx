import React from 'react';
import { AlertCircle, Car, CheckCircle, Clock } from 'lucide-react-native';
import { ConnectedRideStatus, RideRequestStatus } from '@/types/app-types';

export function getStatusIcon(status: string) {
    switch (status) {
        case RideRequestStatus.COMPLETED:
        case ConnectedRideStatus.COMPLETED:
            return <CheckCircle size={16} color="#10b981" />;
        case RideRequestStatus.WAITING:
        case ConnectedRideStatus.WAITING:
            return <Clock size={16} color="#f59e0b" />;
        case RideRequestStatus.CANCELLED:
        case ConnectedRideStatus.CANCELLED_BY_DRIVER:
        case ConnectedRideStatus.CANCELLED_BY_PASSENGER:
            return <AlertCircle size={16} color="#ef4444" />;
        case ConnectedRideStatus.DRIVING:
            return <Car size={16} color="#3b82f6" />;
        default:
            return <Clock size={16} color="#6b7280" />;
    }
}

export function getStatusText(status: string) {
    switch (status) {
        case RideRequestStatus.COMPLETED:
        case ConnectedRideStatus.COMPLETED:
            return 'I përfunduar';
        case RideRequestStatus.WAITING:
            return 'Në pritje';
        case ConnectedRideStatus.WAITING:
            return 'Duke pritur';
        case RideRequestStatus.CANCELLED:
            return 'Anuluar';
        case ConnectedRideStatus.CANCELLED_BY_DRIVER:
            return 'Anuluar nga shoferi';
        case ConnectedRideStatus.CANCELLED_BY_PASSENGER:
            return 'Anuluar nga pasagjeri';
        case ConnectedRideStatus.DRIVING:
            return 'Në progres';
        default:
            return status;
    }
}

