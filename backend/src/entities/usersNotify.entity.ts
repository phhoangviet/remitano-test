import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { NotificationEntity } from './notify.entity';
import { UserNotification } from '@/interfaces/user_notify.interface';
import { UserEntity } from './users.entity';
@Entity({
  name: 'user_notifications',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class UserNotificationsEntity implements UserNotification {
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

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity | null;
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

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
