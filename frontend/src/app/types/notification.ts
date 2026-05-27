export type NotificationResponse = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  sentAt: string;
};

export type NotificationItem = NotificationResponse;
