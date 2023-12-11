import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FundService {
  private api = 'https://ivarpivar.netlify.app/api';

  constructor(private http: HttpClient) { }

  getFundList(): Observable<any> {
    return this.http.get(this.api);
  }
}
