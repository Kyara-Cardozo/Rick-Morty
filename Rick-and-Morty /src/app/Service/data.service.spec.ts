import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { environment } from '../../environments/environment';
import { Character } from '../Interface/character';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have apiUrl from environment', () => {
    expect((service as any).apiUrl).toBe(environment.apiUrl);
  });

  it('should call the correct API endpoint in getCharacterById and return the character', () => {
    const mockCharacter: Character = { id: 1, name: 'Rick', status: 'Alive' } as Character;
    const id = 1;

    service.getCharacterById(id).subscribe(character => {
      expect(character).toEqual(mockCharacter);
    });

    const reqs = httpMock.match(
      r => r.method === 'GET' && r.url === `${environment.apiUrl}/character/${id}`
    );
    expect(reqs.length).toBe(2);
    reqs.forEach(req => req.flush(mockCharacter));
  });

  it('should update characterByIdSignal after getCharacterById is called', () => {
    const mockCharacter: Character = { id: 2, name: 'Morty', status: 'Alive' } as Character;
    const id = 2;

    service.getCharacterById(id).subscribe();

    const reqs = httpMock.match(
      r => r.method === 'GET' && r.url === `${environment.apiUrl}/character/${id}`
    );
    expect(reqs.length).toBe(2);
    reqs[0].flush(mockCharacter);
    reqs[1].flush(mockCharacter);

    expect(service.characterById).toEqual(mockCharacter);
  });

  it('should call the correct API endpoint in searchCharacters and return the characters', () => {
    const mockCharacters: Character[] = [
      { id: 1, name: 'Rick', status: 'Alive' } as Character,
      { id: 2, name: 'Morty', status: 'Alive' } as Character
    ];
    const name = 'Rick';
    const status = 'Alive';

    service.searchCharacters(name, status).subscribe(characters => {
      expect(characters).toEqual(mockCharacters);
    });

    const reqs = httpMock.match(
      r =>
        r.method === 'GET' &&
        r.url === `${environment.apiUrl}/character/` &&
        r.params.get('name') === name &&
        r.params.get('status') === status
    );
    expect(reqs.length).toBe(2);
    reqs.forEach(req => req.flush(mockCharacters));
  });

  it('should update searchCharactersSignal after searchCharacters is called', () => {
    const mockCharacters: Character[] = [
      { id: 3, name: 'Summer', status: 'Alive' } as Character
    ];
    const name = 'Summer';
    const status = 'Alive';

    service.searchCharacters(name, status).subscribe();

    const reqs = httpMock.match(
      r =>
        r.method === 'GET' &&
        r.url === `${environment.apiUrl}/character/` &&
        r.params.get('name') === name &&
        r.params.get('status') === status
    );
    expect(reqs.length).toBe(2);
    reqs[0].flush(mockCharacters);
    reqs[1].flush(mockCharacters);

    expect(service.searchResults).toEqual(mockCharacters);
  });

it('should call the correct API endpoint in getCharacters and return the results', () => {
  const mockResponse = {
    info: { count: 2, pages: 1, next: null, prev: null },
    results: [
      { id: 1, name: 'Rick', status: 'Alive' } as Character,
      { id: 2, name: 'Morty', status: 'Alive' } as Character
    ]
  };
  const page = 1;

  service.getCharacters(page).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne(
    r =>
      r.method === 'GET' &&
      r.url === `${environment.apiUrl}/character/` &&
      r.params.get('page') === page.toString()
  );
  expect(req).toBeTruthy();
  req.flush(mockResponse);
});

it('should send the correct page parameter in getCharacters', () => {
  const page = 3;
  const mockResponse = {
    info: { count: 10, pages: 5, next: null, prev: null },
    results: [
      { id: 5, name: 'Summer', status: 'Alive' } as Character
    ]
  };

  service.getCharacters(page).subscribe(response => {
    expect(response).toEqual(mockResponse);
  });

  const req = httpMock.expectOne(
    r =>
      r.method === 'GET' &&
      r.url === `${environment.apiUrl}/character/` &&
      r.params.get('page') === page.toString()
  );
  expect(req.request.params.get('page')).toBe(page.toString());
  req.flush(mockResponse);
});

});
