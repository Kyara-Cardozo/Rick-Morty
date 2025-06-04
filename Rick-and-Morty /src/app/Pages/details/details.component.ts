import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Character } from '../../Interface/character';
import { DataService } from '../../Service/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  detailCharacter = signal<Character>({
    name: '',
    status: '',
    species: '',
    type: '',
    gender: '',
    image: '',
    origin: {
      name: '',
      url: '',
    },
    location: {
      name: '',
      url: '',
    },
    episode: [],
    created: '',
  });

  customFields = signal<{ label: string; value: string }[]>([]);

  id = signal<string | null>('0');

  public urlImg: string = '';


  constructor(private route: ActivatedRoute, private service: DataService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id.set(params.get('id'));
      this.getByIdCharacter();
    });
  }
  get paramUrl(): string | null {
    return this.id();
  }


  getByIdCharacter() {
    const idValue = this.id();
    if (!idValue) return;

    const savedCharacter = localStorage.getItem(`character-${idValue}`);
    if (savedCharacter) {
      const parsed = JSON.parse(savedCharacter);
      this.detailCharacter.set(parsed.character);
      this.customFields.set(parsed.customFields || []);
    } else {
      this.service.getCharacterById(idValue).subscribe((data) => {
        this.detailCharacter.set(data);
      });
    }
  }

  urlImgStatus() {
    const status = this.detailCharacter().status;
    if (status === 'Alive') {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Eo_circle_green_blank.svg/1024px-Eo_circle_green_blank.svg.png';
    } else if (status === 'Dead') {
      return 'https://icones.pro/wp-content/uploads/2021/04/icone-cercle-rempli-rouge.png';
    } else {
      return 'https://cdn-icons-png.flaticon.com/512/14/14934.png';
    }
  }


  salvarEdicoes() {
    const dataParaSalvar = {
      character: this.detailCharacter(),
      customFields: this.customFields(),
    };
    localStorage.setItem(`character-${this.id()}`, JSON.stringify(dataParaSalvar));
    alert('Alterações salvas com sucesso!');
  }

  removerOrigem() {
    const confirmado = confirm('Tem certeza que deseja excluir a origem?');
    if (confirmado) {
      const current = this.detailCharacter();
      this.detailCharacter.set({
        ...current,
        origin: {
          ...current.origin,
          name: '',
          url: current.origin.url,
        },
      });
      this.salvarEdicoes();
      alert('Origem excluída!');
    }
  }


  adicionarNovoCampo() {
    const novaLabel = prompt('Digite o nome do novo campo:', 'Novo Campo');
    if (novaLabel) {
      this.customFields.update((fields) => [...fields, { label: novaLabel, value: '' }]);
    }
  }

  updateDetailCharacterField<K extends keyof Character>(field: K, value: Character[K]) {
    this.detailCharacter.update((current) => ({ ...current, [field]: value }));
  }
  updateOriginField(value: string) {
    this.detailCharacter.update((current) => ({
      ...current,
      origin: { ...current.origin, name: value },
    }));
  }

  updateLocationField(value: string) {
    this.detailCharacter.update((current) => ({
      ...current,
      location: { ...current.location, name: value },
    }));
  }

  updateCustomFieldValue(index: number, value: string) {
    this.customFields.update((fields) => {
      const updated = [...fields];
      updated[index] = { ...updated[index], value };
      return updated;
    });
  }
}


