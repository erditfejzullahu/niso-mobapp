import type { ConnectedRideStatus, RideRequestStatus } from '@/types/app-types';

export type NotificationType =
    | 'SYSTEM_ALERT'
    | 'MESSAGE'
    | 'RIDE_UPDATE'
    | 'PAYMENT'
    | 'PROMOTIONAL'
    | (string & {});

export function getNotificationContext(type: NotificationType) {
    switch (type) {
        case 'SYSTEM_ALERT':
            return "Ky mesazh është gjeneruar nga sistemi për t'ju informuar mbi ndryshime ose paralajmërime.";
        case 'MESSAGE':
            return 'Ky mesazh ka ardhur nga një përdorues tjetër ose nga stafi i mbështetjes.';
        case 'RIDE_UPDATE':
            return 'Ky njoftim lidhet me udhëtimin tuaj, duke reflektuar ndryshime ose azhurnime.';
        case 'PAYMENT':
            return 'Ky mesazh ka lidhje me pagesat tuaja, faturat ose transaksionet e kryera.';
        case 'PROMOTIONAL':
            return 'Ky është një njoftim promovues me oferta, shpërblime ose kampanja speciale.';
        default:
            return 'Ky është një njoftim i përgjithshëm.';
    }
}

export function getNotificationActionButtonText(args: {
    type: NotificationType;
    connectedRideStatus?: ConnectedRideStatus | null;
    rideRequestStatus?: RideRequestStatus | null;
}) {
    const { type, connectedRideStatus, rideRequestStatus } = args;

    switch (type) {
        case 'SYSTEM_ALERT':
            return 'Shiko Detajet';
        case 'MESSAGE':
            return 'Përgjigju';
        case 'RIDE_UPDATE': {
            const status = connectedRideStatus ?? rideRequestStatus ?? null;
            if (!status) return 'Shiko Udhëtimin';

            if (status === 'COMPLETED') return 'Shiko Detajet';
            if (
                status === 'CANCELLED' ||
                status === 'CANCELLED_BY_DRIVER' ||
                status === 'CANCELLED_BY_PASSENGER'
            )
                return 'Kërko Një Tjetër';
            if (status === 'WAITING') return 'Shiko Kërkesën';
            return 'Shiko Udhëtimin';
        }
        case 'PAYMENT':
            return 'Shiko Pagesën';
        case 'PROMOTIONAL':
            return 'Shfrytëzo Ofertën';
        default:
            return 'Vepro';
    }
}

