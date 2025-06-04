import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CharactersComponent } from './characters.component';
import { DataService } from '../../Service/data.service';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

describe('CharactersComponent', () => {
  let component: CharactersComponent;
  let fixture: ComponentFixture<CharactersComponent>;
  let mockService: any;
  let mockCd: any;

  beforeEach(() => {
    mockService = {
      getCharacters: jest.fn(),
      searchCharacters: jest.fn(),
    };
    mockCd = { detectChanges: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [CharactersComponent],
      providers: [
        { provide: DataService, useValue: mockService },
        { provide: ChangeDetectorRef, useValue: mockCd },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('loadCharacters', () => {
    it('should handle error in observable', () => {
      const error = new Error('fail');
      mockService.getCharacters.mockReturnValue(throwError(() => error));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
      component.loadCharacters();
      expect(consoleSpy).toHaveBeenCalledWith('Erro na resposta character:', error);
      consoleSpy.mockRestore();
    });

    it('should throw error in try-catch', () => {
      mockService.getCharacters.mockImplementation(() => { throw 'sync error'; });
      expect(() => component.loadCharacters()).toThrow('Error na requisição do character: sync error');
    });
  });

  describe('setupSearch', () => {
    it('should call resetSearch when value is empty', fakeAsync(() => {
      component.fieldSearch = new FormControl('');
      mockService.getCharacters.mockReturnValue(of({ results: [] }));
      const resetSpy = jest.spyOn(component, 'resetSearch');
      component.setupSearch();
      component.fieldSearch.setValue('');
      tick(1000);
      expect(resetSpy).toHaveBeenCalled();
    }));

    it('should call searchCharacter when value is not empty', fakeAsync(() => {
      component.fieldSearch = new FormControl('');
      mockService.searchCharacters.mockReturnValue(of([]));
      const searchSpy = jest.spyOn(component, 'searchCharacter');
      component.setupSearch();
      component.fieldSearch.setValue('Rick');
      tick(1000);
      expect(searchSpy).toHaveBeenCalled();
    }));
  });

  describe('searchCharacter', () => {
    it('should set notFoundCharacter on 404 error', () => {
      const error = { status: 404 };
      mockService.searchCharacters.mockReturnValue(throwError(() => error));
      component.fieldSearch.setValue('Unknown');
      component.valueSelectStatus = '';
      component.searchCharacter();
      expect(component.notFoundCharacter).toBe(true);
      expect(component.loading).toBe(false);
    });

    it('should throw error in try-catch', () => {
      mockService.searchCharacters.mockImplementation(() => { throw 'sync error'; });
      expect(() => component.searchCharacter()).toThrow('Erro na requisição de busca pelo input: sync error');
    });
  });


  describe('onStatusChange', () => {
    it('should call resetSearch if valueSelectStatus is empty', () => {
      mockService.getCharacters.mockReturnValue(of({ results: [] }));
      const resetSpy = jest.spyOn(component, 'resetSearch');
      component.valueSelectStatus = '';
      component.onStatusChange();
      expect(resetSpy).toHaveBeenCalled();
    });

    it('should call searchCharacter if valueSelectStatus is not empty', () => {
      mockService.searchCharacters.mockReturnValue(of([]));
      const searchSpy = jest.spyOn(component, 'searchCharacter');
      component.valueSelectStatus = 'Alive';
      component.onStatusChange();
      expect(searchSpy).toHaveBeenCalled();
    });
  });
});
