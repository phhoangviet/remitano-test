import { PrimaryGeneratedColumn, Column, Entity, Unique, BaseEntity, CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './users.entity';
import { Notification } from '@/interfaces/notify.interface';

@Entity({
  name: 'notifications',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class NotificationEntity implements Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    name: 'group',
    nullable: true,
  })
  group?: string | null;

  @Column({
    type: 'int',
    name: 'ref_id',
    nullable: true,
  })
  refId?: number | null;
  @Column({
    type: 'text',
    name: 'ref_code',
    nullable: true,
  })
  refCode?: string | null;
  @Column({
    type: 'text',
    name: 'title',
    nullable: true,
  })
  title?: string | null;
  @Column({
    type: 'text',
    name: 'content',
    nullable: true,
  })
  content?: string | null;
  @Column({
    type: 'text',
    name: 'url',
    nullable: true,
  })
  url?: string | null;
  @Column({
    type: 'text',
    name: 'action',
    nullable: true,
  })
  action?: string | null;

  @Column({
    type: 'jsonb',
    name: 'data',
    nullable: true,
  })
  data?: Object | null;
  @Column({
    type: 'int',
    name: 'created_by_id',
    nullable: true,
  })
  createdById?: number | null;
  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'created_by_id',
    referencedColumnName: 'id',
  })
  user: UserEntity | null;
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
