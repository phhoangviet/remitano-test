export type User = {
  id: number;
  email: string;
  password: string;
};
export type Notification = {
  id?: number;
  group?: string | null;
  refId?: number | null;
  refCode?: string | null;
  title?: string | null;
  content?: string | null;
  url?: string | null;
  action?: string | null;
  createdById?: number | null;
};

export type UserNotification = {
  notificationId: number;
  userId: number;
  markAsRead?: boolean;
  notification?: Notification;
  user?: User;
  createdAt?: string;
};
