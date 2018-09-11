import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Promise<User[]> {
    return this.http
      .get<any>('/table/users')
      .pipe(
        map((result) => {
          return Object.values(result.rows).map((row) => {
            return Object.assign(new User(), row);
          });
        })
      )
      .toPromise();
  }

  create(data: User): Promise<any> {
    return this.http
      .post('/table/create/user', data)
      .toPromise();
  }
}
