import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { Character } from '../../Interface/character';
import { DataService } from '../../Service/data.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
})
export class CharactersComponent implements OnInit {
  public personCharacters: Character[] = [];
  public page: number = 1;
  public loading: boolean = false;
  public fieldSearch: FormControl = new FormControl('');
  public checkSearch: boolean = false;
  public notFoundCharacter: boolean = false;
  public valueSelectStatus: string = '';

  constructor(private service: DataService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCharacters();
    this.setupSearch();
  }

  loadCharacters() {
    try {
      this.loading = true;
      this.service.getCharacters(this.page).subscribe(
        (response) => {
          this.personCharacters = [
            ...this.personCharacters,
            ...response['results'],
          ];
          this.loading = false;
          this.cd.detectChanges();
        },
        (error) => {
          console.error('Erro na resposta character:', error);
        }
      );
    } catch (error) {
      throw new Error('Error na requisição do character: ' + error);
    }
  }

  @HostListener('window:scroll', ['$event'])
  infiniteScroll() {
    if (this.checkSearch) {
      return;
    }

    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !this.loading
    ) {
      this.page++;
      this.loadCharacters();
    }
  }

  setupSearch() {
     this.fieldSearch.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value: string) => {
        if (value === '') {
          this.resetSearch();
        } else {
          this.searchCharacter();
        }
      });
  }

  searchCharacter() {
    try {
      this.loading = true;
      this.service
        .searchCharacters(this.fieldSearch.value, this.valueSelectStatus)
        .subscribe(
          (data) => {
            this.personCharacters = data;
            this.checkSearch = true;
            this.loading = false;
            this.cd.detectChanges();
          },
          (err) => {
            if (err.status === 404) {
              this.notFoundCharacter = true;
            }
            this.loading = false;
          }
        );
    } catch (error) {
      throw new Error('Erro na requisição de busca pelo input: ' + error);
    }
  }

  resetSearch() {
    this.checkSearch = false;
    this.notFoundCharacter = false;
    this.page = 1;
    this.personCharacters = [];
    this.loadCharacters();
  }

  onStatusChange() {
    if (this.valueSelectStatus === '') {
      this.resetSearch();
    } else {
      this.searchCharacter();
    }
  }
}
