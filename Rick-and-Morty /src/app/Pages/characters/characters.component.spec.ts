import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { DataService } from '../../Service/data.service';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;
  let dataServiceMock: jest.Mocked<DataService>;
  let mockService: any;
  let mockCd: any;

  beforeEach(() => {
    dataServiceMock = {
      getCharacters: jest.fn().mockReturnValue(of({ results: [] })),
      searchCharacters: jest.fn().mockReturnValue(of([])),
    } as any;
    mockService = {
      getCharacters: jest.fn(),
      searchCharacters: jest.fn(),
    };
    mockService.getCharacters.mockReturnValue(of({ results: [] }));

    mockCd = { detectChanges: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [CharactersComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: DataService, useValue: mockService },
        { provide: ChangeDetectorRef, useValue: mockCd },
        { provide: DataService, useValue: dataServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call resetSearch if valueSelectStatus is empty', () => {
    const resetSpy = jest.spyOn(component, 'resetSearch');
    const searchSpy = jest.spyOn(component, 'searchCharacter');
    component.valueSelectStatus.set('');
    component.onStatusChange();
    expect(resetSpy).toHaveBeenCalled();
    expect(searchSpy).not.toHaveBeenCalled();
  });

  it('should call searchCharacter if valueSelectStatus is not empty', () => {
    const resetSpy = jest.spyOn(component, 'resetSearch');
    const searchSpy = jest.spyOn(component, 'searchCharacter');
    component.valueSelectStatus.set('Alive');
    component.onStatusChange();
    expect(searchSpy).toHaveBeenCalled();
    expect(resetSpy).not.toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error in loadCharacters', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    dataServiceMock.getCharacters.mockReturnValueOnce({
      subscribe: ({ next, error }: any) => error('erro simulado')
    } as any);

    component.loadCharacters();

    expect(console.error).toHaveBeenCalledWith('Erro na resposta character:', 'erro simulado');
    expect(component.loading()).toBe(false);
  });

  it('should return early if checkSearch is true', () => {
    jest.spyOn(component, 'loadCharacters');
    component.checkSearch.set(true);
    component.infiniteScroll();
    expect(component.loadCharacters).not.toHaveBeenCalled();
  });

  it('should call loadCharacters and increment page if near bottom and not loading', () => {
    jest.spyOn(component, 'loadCharacters');
    component.checkSearch.set(false);
    component.loading.set(false);
    component.page.set(1);

    // Mock window/document values
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 2000, writable: true });
    Object.defineProperty(document.body, 'offsetHeight', { value: 2400, writable: true });

    component.infiniteScroll();

    expect(component.page()).toBe(2);
    expect(component.loadCharacters).toHaveBeenCalled();
  });

  it('should not call loadCharacters if loading is true', () => {
    jest.spyOn(component, 'loadCharacters');
    component.checkSearch.set(false);
    component.loading.set(true);
    component.page.set(1);

    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 2000, writable: true });
    Object.defineProperty(document.body, 'offsetHeight', { value: 2400, writable: true });

    component.infiniteScroll();

    expect(component.page()).toBe(1);
    expect(component.loadCharacters).not.toHaveBeenCalled();
  });

  it('should not call loadCharacters if not near bottom', () => {
    jest.spyOn(component, 'loadCharacters');
    component.checkSearch.set(false);
    component.loading.set(false);
    component.page.set(1);

    Object.defineProperty(window, 'innerHeight', { value: 500, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
    Object.defineProperty(document.body, 'offsetHeight', { value: 3000, writable: true });

    component.infiniteScroll();

    expect(component.page()).toBe(1);
    expect(component.loadCharacters).not.toHaveBeenCalled();
  });

  it('should set notFoundCharacter true and personCharacters empty if error status is 404', () => {
    dataServiceMock.searchCharacters.mockReturnValueOnce({
      subscribe: ({ next, error }: any) => error({ status: 404 })
    } as any);

    component.searchCharacter();

    expect(component.notFoundCharacter()).toBe(true);
    expect(component.personCharacters()).toEqual([]);
    expect(component.loading()).toBe(false);
  });
  describe('loadCharacters', () => {
    describe('ngOnInit', () => {
      it('should call loadCharacters on initialization', () => {
        const loadCharactersSpy = jest.spyOn(component, 'loadCharacters');
        component.ngOnInit();
        expect(loadCharactersSpy).toHaveBeenCalled();
      });

      it('should set loading to false if getCharacters errors', () => {
        mockService.getCharacters.mockReturnValue(throwError(() => new Error('fail')));
        component.ngOnInit();
        expect(component.loading()).toBe(false);
      });
      describe('searchCharacter', () => {

        it('should set notFoundCharacter true and personCharacters empty if error status is 404', () => {
          const error = { status: 404 };
          mockService.searchCharacters.mockReturnValue(throwError(() => error));
          component.fieldSearch.setValue('Unknown');
          component.valueSelectStatus.set('Dead');
          component.searchCharacter();
          expect(component.notFoundCharacter()).toBe(false);
          expect(component.personCharacters()).toEqual([]);
          expect(component.loading()).toBe(false);
        });

        it('should set loading to false if error status is not 404', () => {
          const error = { status: 500 };
          mockService.searchCharacters.mockReturnValue(throwError(() => error));
          component.fieldSearch.setValue('Morty');
          component.valueSelectStatus.set('Alive');
          component.searchCharacter();
          expect(component.notFoundCharacter()).toBe(false);
          expect(component.loading()).toBe(false);
        });
      });
      describe('resetSearch', () => {
        it('should reset checkSearch, notFoundCharacter, page, personCharacters and call loadCharacters', () => {
          const loadCharactersSpy = jest.spyOn(component, 'loadCharacters');
          component.checkSearch.set(true);
          component.notFoundCharacter.set(true);
          component.page.set(5);
          component.personCharacters.set([{ id: 1, name: 'Rick' } as any]);
          component.resetSearch();
          expect(component.checkSearch()).toBe(false);
          expect(component.notFoundCharacter()).toBe(false);
          expect(component.page()).toBe(1);
          expect(component.personCharacters()).toEqual([]);
          expect(loadCharactersSpy).toHaveBeenCalled();
        });
      });
      describe('onStatusChange', () => {
        it('should call resetSearch if valueSelectStatus is empty', () => {
          const resetSearchSpy = jest.spyOn(component, 'resetSearch');
          component.valueSelectStatus.set('');
          component.onStatusChange();
          expect(resetSearchSpy).toHaveBeenCalled();
        });
        it('should call resetSearch onStatusChange if valueSelectStatus is empty', () => {
          jest.spyOn(component, 'resetSearch');
          jest.spyOn(component, 'searchCharacter');
          component.valueSelectStatus.set('');
          component.onStatusChange();
          expect(component.resetSearch).toHaveBeenCalled();
          expect(component.searchCharacter).not.toHaveBeenCalled();
        });

      });
    });
  });
});

