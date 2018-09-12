import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { UserList } from '../models/user-list';
import { ActionResponse } from '../models/action-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Promise<User[]> {
    return this.http
      .get<UserList>('/table/users')
      .pipe(
        map((result: UserList) => {
          return Object.values(result.rows).map((row) => {
            return Object.assign(new User(), row);
          });
        })
      )
      .toPromise();
  }

  post(data: User): Promise<ActionResponse> {
    return this.http
      .post<ActionResponse>('/table/create/user', data)
      .toPromise();
  }

  put(id: string, data: User): Promise<ActionResponse> {
    return this.http
      .put<ActionResponse>(`/table/update/user/${id}`, data)
      .toPromise();
  }

  delete(id: string): Promise<ActionResponse> {
    return this.http
      .delete<ActionResponse>(`/table/delete/user/${id}`)
      .toPromise();
  }
}
