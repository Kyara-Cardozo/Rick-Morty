import { Component, Input } from '@angular/core';
import { Character } from '../../Interface/character';

@Component({
  selector: 'card-character',
  templateUrl: './card-character.component.html',
  styleUrl: './card-character.component.scss',
})
export class CardCharacterComponent {
  @Input() characters: Character[] = [];
  @Input() loading?: boolean;


}
