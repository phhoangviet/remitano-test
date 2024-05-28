import { PrimaryGeneratedColumn, Column, Entity, Unique, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './users.entity';
import { SharedData } from '@/interfaces/shared_data.interface';

@Entity({
  name: 'shared_data',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class SharedDataEntity implements SharedData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    name: 'title',
  })
  title: string;

  @Column({
    type: 'text',
    name: 'url',
  })
  url: string;

  @Column({
    type: 'text',
    name: 'content',
    nullable: true,
  })
  content: string;

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
