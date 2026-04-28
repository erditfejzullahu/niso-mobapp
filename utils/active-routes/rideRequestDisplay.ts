import { RideRequest, RideRequestStatus } from '@/types/app-types';

/** Passenger set an explicit EUR price vs distance-based tariff. */
export function hasPassengerFixedPrice(ride: RideRequest): boolean {
    return ride.distanceCalculatedPriceRide !== true;
}

export function formatRidePriceLabel(ride: RideRequest): string {
    if (ride.distanceCalculatedPriceRide) {
        return 'Llogaritet sipas distancës';
    }
    return `${ride.price} €`;
}

export function rideRequestStatusLabel(status: RideRequestStatus): string {
    switch (status) {
        case RideRequestStatus.WAITING:
            return 'Në pritje';
        case RideRequestStatus.COMPLETED:
            return 'E përfunduar';
        case RideRequestStatus.CANCELLED:
            return 'E anuluar';
        default:
            return status;
    }
}
