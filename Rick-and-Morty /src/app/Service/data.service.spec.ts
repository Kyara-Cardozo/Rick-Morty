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

  it('should call getCharacterById and return a Character', () => {
    const mockCharacter: Character = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: '',
      episode: [],
      created: ''
    };

    service.getCharacterById(1).subscribe(character => {
      expect(character).toEqual(mockCharacter);
    });

    const requests = httpMock.match(`${environment.apiUrl}/character/1`);
    expect(requests.length).toBe(2);
    requests.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush(mockCharacter);
    });

    it('should search characters (single page)', () => {
      const mockResponse = {
        info: { pages: 1 },
        results: [{ id: 1, name: 'Rick', status: 'Alive', species: '', type: '', gender: '', origin: { name: '', url: '' }, location: { name: '', url: '' }, image: '', episode: [], created: '' }]
      };

      service.searchCharacters('Rick', 'Alive').subscribe(results => {
        expect(results.length).toBe(1);
        expect(results[0].name).toBe('Rick');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/character/?name=Rick&status=Alive`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should search characters (multiple pages)', () => {
      const mockResponsePage1 = {
        info: { pages: 2 },
        results: [{ id: 1, name: 'Rick', status: 'Alive', species: '', type: '', gender: '', origin: { name: '', url: '' }, location: { name: '', url: '' }, image: '', episode: [], created: '' }]
      };
      const mockResponsePage2 = {
        results: [{ id: 2, name: 'Morty', status: 'Alive', species: '', type: '', gender: '', origin: { name: '', url: '' }, location: { name: '', url: '' }, image: '', episode: [], created: '' }]
      };

      service.searchCharacters('Rick', 'Alive').subscribe(results => {
        expect(results.length).toBe(2);
        expect(results[0].name).toBe('Rick');
        expect(results[1].name).toBe('Morty');
      });

      const req1 = httpMock.expectOne(`${environment.apiUrl}/character/?name=Rick&status=Alive`);
      expect(req1.request.method).toBe('GET');
      req1.flush(mockResponsePage1);

      const req2 = httpMock.expectOne(`${environment.apiUrl}/character/?name=Rick&status=Alive&page=2`);
      expect(req2.request.method).toBe('GET');
      req2.flush(mockResponsePage2);
    });
  });
  });
