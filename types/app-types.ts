// ======================
// Enums
// ======================
export enum Role {
  DRIVER = "DRIVER",
  PASSENGER = "PASSENGER",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum RideRequestStatus {
  WAITING = "WAITING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ConnectedRideStatus {
  WAITING = "WAITING",
  DRIVING = "DRIVING",
  COMPLETED = "COMPLETED",
  CANCELLED_BY_DRIVER = "CANCELLED_BY_DRIVER",
  CANCELLED_BY_PASSENGER = "CANCELLED_BY_PASSENGER",
}

export enum NotificationType {
  MESSAGE = "MESSAGE",
  SYSTEM_ALERT = "SYSTEM_ALERT",
  PAYMENT = "PAYMENT",
  RIDE_UPDATE = "RIDE_UPDATE",
  REVIEW = "REVIEW",
  PROMOTIONAL = "PROMOTIONAL",
}

export enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
  WALLET = "WALLET",
}

export enum KosovoCity {
  PRISHTINE = "PRISHTINE",
  PRIZREN = "PRIZREN",
  FERIZAJ = "FERIZAJ",
  GJAKOVE = "GJAKOVE",
  PEJE = "PEJE",
  MITROVICE = "MITROVICE",
  GJILAN = "GJILAN",
  PODUJEVE = "PODUJEVE",
  OBILIQ = "OBILIQ",
  FUSHE_KOSOVE = "FUSHE_KOSOVE",
  DRENAS = "DRENAS",
  SKENDERAJ = "SKENDERAJ",
  VUSHTRRI = "VUSHTRRI",
  LIPJAN = "LIPJAN",
  SHTIME = "SHTIME",
  SUHAREKE = "SUHAREKE",
  RAHOVEC = "RAHOVEC",
  DRAGASH = "DRAGASH",
  MALISHEVE = "MALISHEVE",
  KACANIK = "KACANIK",
  HANI_I_ELEZIT = "HANI_I_ELEZIT",
  KAMENICE = "KAMENICE",
  VITI = "VITI",
  GRACANICE = "GRACANICE",
  SHTERPCE = "SHTERPCE",
  KLLOKOT = "KLLOKOT",
  NOVOBERDE = "NOVOBERDE",
  RANILLUG = "RANILLUG",
  PARTESH = "PARTESH",
  JUNIK = "JUNIK",
  KLINE = "KLINE",
  ISTOG = "ISTOG",
  DECAN = "DECAN",
  ZUBIN_POTOK = "ZUBIN_POTOK",
  ZVECAN = "ZVECAN",
  LEPOSAVIQ = "LEPOSAVIQ",
  MITROVICE_E_VERIUT = "MITROVICE_E_VERIUT",
  MAMUSHE = "MAMUSHE",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  RATHER_NOT_SAY = "RATHER_NOT_SAY",
}

export enum ConversationType {
  RIDE_RELATED = "RIDE_RELATED",
  SUPPORT = "SUPPORT",
  OTHER = "OTHER",
}

// ======================
// Interfaces (Models)
// ======================

export interface UserProfileDetails {
  profileDetails: {
    userInformations: UserInformation,
    preferredDrivers?: number | null;
    completedRides?: number | null;
    passengerExpenses?: number | null;
    regularClients?: number | null;
    driverNetEarnings?: number | null;
  }
}

export interface RefreshToken {
  userId: string;
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  password: string;
  role: Role;
  user_verified: boolean;
  image: string;

  refreshToken?: RefreshToken[];
  userInformation?: UserInformation | null;
  ridesAsDriver?: ConnectedRide[];
  ridesAsPassenger?: ConnectedRide[];
  rideRequests?: RideRequest[];
  acceptedRequests?: RideRequest[];
  preferredDrivers?: PreferredDriver[];
  preferredByUsers?: PreferredDriver[];
  driverConversations?: Conversations[];
  passengerConversations?: Conversations[];
  sendedMessages?: Message[];
  rotations?: PassengerRotation[];
  notifications?: Notification[];
  driverEarnings?: DriverEarning[];
  passengerPayments?: PassengerPayment[];
  driverFixedTarifs?: DriverFixedTarifs[];

  createdAt: Date;
  updatedAt: Date;
}

export interface UserInformation {
  id: string;
  userId: string;
  ID_Card: string[];
  SelfiePhoto: string;
  address: string;
  city: KosovoCity;
  gender: Gender;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface DriverFixedTarifs {
  id: string;
  userId: string;
  fixedTarifTitle: string;
  city: KosovoCity;
  locationArea: string;
  price: string; // Decimal → string
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface RegularPassengers {
  fullName: string;
  id: string;
  image: string;
  userInformation: {
    address: string;
    yourDesiresForRide: string;
  },
  ridesWithDriver: number;
}

export interface RideRequest {
  id: string;
  passengerId: string;
  driverId?: string | null;
  price: string;
  fromAddress: string;
  toAddress: string;
  status: RideRequestStatus;
  createdAt: Date;
  updatedAt: Date;

  distanceKm: string;

  isUrgent: boolean;
  distanceCalculatedPriceRide: boolean;

  passenger: User;
  driver?: User | null;
  connectedRide?: ConnectedRide | null;
  rideRequestConversation?: Conversations | null;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface ConnectedRide {
  id: string;
  driverId: string;
  passengerId: string;
  rideRequestId: string;
  status: ConnectedRideStatus;
  createdAt: Date;
  updatedAt: Date;

  driver: User;
  passenger: User;
  rideRequest: RideRequest;
  driverEarning?: DriverEarning | null;
  passengerPayment?: PassengerPayment | null;
}

export interface DriverEarning {
  id: string;
  driverId: string;
  rideId: string;
  amount: string;
  fee: string;
  netEarnings: string;
  status: PaymentStatus;
  paymentDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  driver: User;
  ride: ConnectedRide;
}

export interface PassengerPayment {
  id: string;
  passengerId: string;
  rideId: string;
  amount: string;
  surcharge?: string | null;
  totalPaid: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  passenger: User;
  ride: ConnectedRide;
}

export interface PassengerRotation {
  id: string;
  userId: string;
  fromAddress: string;
  toAddress: string;
  days?: string | null;
  time?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}


interface NotificationMetadatas {
  modelAction?: boolean;
  notificationSender?: User | null;
  navigateAction?: {
    connectedRide?: string | null,
    rideRequest?: string | null
  }
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  metadata?: NotificationMetadatas;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface PreferredDriver {
  id: string;
  driverId: string;
  passengerId: string;
  whyPrefered?: string | null;
  createdAt: Date;
  updatedAt: Date;
  driver: User;
  passenger: User;
}

export interface Conversations {
  id: string;
  driverId: string;
  passengerId: string;
  rideRequestId?: string | null;
  type: ConversationType;
  subject?: string | null;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date | null;

  driver: User;
  passenger: User;
  rideRequest?: RideRequest | null;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: Role;
  content: string;
  mediaUrls: string[];
  priceOffer?: string | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  conversation: Conversations;
  sender: User;
}
