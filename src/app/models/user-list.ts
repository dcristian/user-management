import { User } from './user';

export class UserList {
  rows: {
    [key: string]: User;
  };
}
