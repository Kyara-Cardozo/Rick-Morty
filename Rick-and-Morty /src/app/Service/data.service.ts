import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, mergeMap, of, toArray } from 'rxjs';
import { environment } from '../../environments/environment';
import { Character } from '../Interface/character';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCharacterById(id: number | string): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/character/${id}`);
  }

  searchCharacters(name: string = '', status: string = ''): Observable<Character[]> {
    const params = new HttpParams()
      .set('name', name)
      .set('status', status);

    return this.http.get<Character>(`${this.apiUrl}/character/`, { params }).pipe(
      mergeMap(response => {
        const totalPages = response['info'].pages;
        const requests: Observable<Character>[] = [];

        for (let page = 2; page <= totalPages; page++) {
          const pageParams = params.set('page', page.toString());
          requests.push(this.http.get<Character>(`${this.apiUrl}/character/`, { params: pageParams }));
        }

        return of(response).pipe(
          mergeMap(res => of(...requests).pipe(
            mergeMap(req => req),
            toArray(),
            map(pages => [res, ...pages])
          )),
          map(responses => responses.flatMap(res => res['results']))
        );
      })
    );
  }

  getCharacters(page: number): Observable<Character> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<Character>(`${this.apiUrl}/character/`, { params });
  }
}
