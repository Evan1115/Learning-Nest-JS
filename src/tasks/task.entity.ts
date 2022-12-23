import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user)=> user.tasks , {eager: false}) // many tasks can belongs to one user, eager = false means when query task we will not get user info
  @Exclude({toPlainOnly: true}) //exclude this property in json reponse when we convert(serialize) object to plain object text using toPlainOnly() method but have to use with interceptop transformer so that nest js know to exlcude it  when serializing
  user: User;
}
