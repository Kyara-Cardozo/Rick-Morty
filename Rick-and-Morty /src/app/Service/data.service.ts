import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map, mergeMap, of, toArray } from 'rxjs';
import { environment } from '../../environments/environment';
import { Character } from '../Interface/character';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = environment.apiUrl;

  private characterByIdSignal = signal<Character | null>(null);

  constructor(private http: HttpClient) { }

  getCharacterById(id: number | string): Observable<Character> {
    this.http.get<Character>(`${this.apiUrl}/character/${id}`).subscribe(character => {
      this.characterByIdSignal.set(character);
    });
    return this.http.get<Character>(`${this.apiUrl}/character/${id}`);
  }

  get characterById() {
    return this.characterByIdSignal();
  }

  private searchCharactersSignal = signal<Character[]>([]);

  searchCharacters(name: string = '', status: string = ''): Observable<Character[]> {
    const params = new HttpParams()
      .set('name', name)
      .set('status', status);

    this.http.get<Character[]>(`${this.apiUrl}/character/`, { params }).subscribe(results => {
      this.searchCharactersSignal.set(results);
    });

    return this.http.get<Character[]>(`${this.apiUrl}/character/`, { params });
  }

  get searchResults() {
    return this.searchCharactersSignal();
  }

  getCharacters(page: number): Observable<{ info: any; results: Character[] }> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<{ info: any; results: Character[] }>(`${this.apiUrl}/character/`, { params });
  }

}
