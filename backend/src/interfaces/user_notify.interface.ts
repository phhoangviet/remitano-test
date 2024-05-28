import { Notification } from './notify.interface';
import { User } from './users.interface';

export interface UserNotification {
  notificationId: number;
  userId: number;
  markAsRead?: boolean;
  notification?: Notification;
  user?: User;
}
