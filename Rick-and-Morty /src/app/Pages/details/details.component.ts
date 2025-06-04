import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Character } from '../../Interface/character';
import { DataService } from '../../Service/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  public detailCharacter: Character = {
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
  };
  private id: string | null = '0';
  public urlImg: string = '';

  constructor(private route: ActivatedRoute, private service: DataService) {}
  ngOnInit() {
    this.getParamUrl();
    this.getByIdCharacter();
  }

  getParamUrl(): string {
    try {
      this.route.paramMap.subscribe((value) => (this.id = value.get('id')));
    } catch (error) {
      throw Error('Errou ao consultar a id da Url: ' + error);
    }
    return this.id!!;
  }

  getByIdCharacter() {
    try {
      this.service.getCharacterById(this.id!!).subscribe((data) => {
        this.detailCharacter = data;
      });
    } catch (error) {
      throw Error('Erro ao consultar a Character por ID: ' + error);
    }
  }

  urlImgStatus(): string {
    if (this.detailCharacter.status == 'Alive') {
      this.urlImg =
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Eo_circle_green_blank.svg/1024px-Eo_circle_green_blank.svg.png';
    } else if (this.detailCharacter.status == 'Dead') {
      this.urlImg =
        'https://icones.pro/wp-content/uploads/2021/04/icone-cercle-rempli-rouge.png';
    } else {
      this.urlImg = 'https://cdn-icons-png.flaticon.com/512/14/14934.png';
    }

    return this.urlImg;
  }
}
