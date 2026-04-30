/**
 * Server → client events emitted from ConversationsGateway / gateway services.
 * Extend as you add new backend emits.
 */
export const SERVER_SOCKET_EVENTS = {
  newMessage: "newMessage",
  conversationAlert: "conversationAlert",
  errorSendingMessage: "errorSendingMessage",
  contactedDriverOtherReason: "contactedDriverOtherReason",
  makeReadMessages: "makeReadMessages",
  newNotification: "newNotification",
  newRideRequest: "newRideRequest",
  passengerAcceptedPriceOffer: "passengerAcceptedPriceOffer",
  driverAcceptedPriceOffer: "driverAcceptedPriceOffer",
  passengerSendedPriceOffer: "passengerSendedPriceOffer",
  driverSendedPriceOffer: "driverSendedPriceOffer",
  newDriverInTown: "newDriverInTown",
  newTarifInTown: "newTarifInTown",
  passengerFinishedConversation: "passengerFinishedConversation",
  driverManuallyCompletedRide: "driverManuallyCompletedRide",
  passengerManuallyCanceledRide: "passengerManuallyCanceledRide",
  getNotifiedWhenRideStarts: "getNotifiedWhenRideStarts",
  notificationCounterUpdater: "notificationCounterUpdater",
  newNotificationListener: "newNotificationListener",
  unreadMessagesCounter: "unreadMessagesCounter",
  unreadNotificationsCounter: "unreadNotificationsCounter",
  passengerNotifiedThatDriverIsReady: "passengerNotifiedThatDriverIsReady"

} as const;

export type ServerSocketEventName =
  (typeof SERVER_SOCKET_EVENTS)[keyof typeof SERVER_SOCKET_EVENTS];

/** Client → server (matches @SubscribeMessage handlers). */
export const CLIENT_SOCKET_EVENTS = {
  sendOtherMessage: "sendOtherMessage",
} as const;

export type ClientSocketEventName =
  (typeof CLIENT_SOCKET_EVENTS)[keyof typeof CLIENT_SOCKET_EVENTS];
