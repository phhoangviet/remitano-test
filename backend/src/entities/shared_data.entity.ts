import { PrimaryGeneratedColumn, Column, Entity, Unique, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({
  name: 'shared_data',
  orderBy: {
    createdAt: 'DESC',
  },
})
@Unique('UNIQUE_SHARED_ENTITY', ['id'])
export class SharedDataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'text',
    name: 'title',
    nullable: true,
  })
  title?: string | null;

  @Column({
    type: 'text',
    name: 'url',
    nullable: true,
  })
  url?: string | null;
  @Column({
    type: 'text',
    name: 'content',
    nullable: true,
  })
  content?: string | null;

  @Column({
    type: 'int',
    name: 'up_voute',
    nullable: true,
  })
  upVote?: number | null;
  @Column({
    type: 'int',
    name: 'down_voute',
    nullable: true,
  })
  downVote?: number | null;

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
}
