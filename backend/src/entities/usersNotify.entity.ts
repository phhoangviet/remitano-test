import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { NotificationEntity } from './notify.entity';
import { UserNotify } from '@/interfaces/user_notify.interface';
@Entity({
  name: 'user_notifications',
  orderBy: {
    createdAt: 'DESC',
  },
})
@Unique('UNIQUE_USER_NOTIFICATION_ENTITY', ['id'])
export class UserNotificationsEntity implements UserNotify {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    name: 'notification_id',
    nullable: false,
  })
  notificationId: number;

  @Column({
    type: 'int',
    name: 'user_id',
    nullable: false,
  })
  userId: number;

  @Column({
    type: 'bool',
    name: 'mark_as_read',
    nullable: false,
    default: false,
  })
  markAsRead: boolean;

  @ManyToOne(() => NotificationEntity)
  @JoinColumn({
    name: 'notification_id',
    referencedColumnName: 'id',
  })
  notification: NotificationEntity | null;
}
