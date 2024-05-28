import { User } from './users.interface';

export interface SharedData {
  title: string;
  url: string;
  content: string;
  createdById?: number;
  user: User;
}
