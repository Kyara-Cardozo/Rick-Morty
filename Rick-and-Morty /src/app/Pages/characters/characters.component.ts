import {
  Component,
  effect,
  HostListener,
  signal,
} from '@angular/core';
import { Character } from '../../Interface/character';
import { DataService } from '../../Service/data.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
})
export class CharactersComponent {
  personCharacters = signal<Character[]>([]);
  loading = signal(false);
  page = signal(1);
  checkSearch = signal(false);
  notFoundCharacter = signal(false);
  valueSelectStatus = signal<string>('');

  fieldSearch = new FormControl('');
  fieldSearchSignal = toSignal(
    this.fieldSearch.valueChanges.pipe(debounceTime(1000), distinctUntilChanged()),
    { initialValue: '' }
  );

  constructor(private service: DataService) {
    effect(() => {
      const value = this.fieldSearchSignal();

      if (value === '') {
        queueMicrotask(() => this.resetSearch());
      } else {
        queueMicrotask(() => this.searchCharacter());
      }
    });
  }

  ngOnInit() {
    this.loadCharacters();
  }

  loadCharacters() {
    this.loading.set(true);
    this.service.getCharacters(this.page()).subscribe({
      next: (response) => {
        const currentChars = this.personCharacters();
        const newChars = [...currentChars, ...response['results']];
        this.personCharacters.set(newChars);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro na resposta character:', err);
        this.loading.set(false);
      },
    });
  }


  @HostListener('window:scroll', ['$event'])
  infiniteScroll() {
    if (this.checkSearch()) return;

    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !this.loading()
    ) {
      this.page.set(this.page() + 1);
      this.loadCharacters();
    }
  }

  searchCharacter() {
    this.loading.set(true);
    this.service
      .searchCharacters(this.fieldSearch.value ?? '', this.valueSelectStatus())
      .subscribe({
        next: (data) => {
          this.personCharacters.set(data);
          this.checkSearch.set(true);
          this.notFoundCharacter.set(false);
          this.loading.set(false);
        },
        error: (err) => {
          if (err.status === 404) {
            this.notFoundCharacter.set(true);
            this.personCharacters.set([]);
          }
          this.loading.set(false);
        },
      });
  }

  resetSearch() {
    this.checkSearch.set(false);
    this.notFoundCharacter.set(false);
    this.page.set(1);
    this.personCharacters.set([]);
    this.loadCharacters();
  }

  onStatusChange() {
    if (this.valueSelectStatus() === '') {
      this.resetSearch();
    } else {
      this.searchCharacter();
    }
  }
}
