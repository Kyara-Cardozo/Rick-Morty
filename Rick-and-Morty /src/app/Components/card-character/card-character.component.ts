import { Component, input, signal, computed } from '@angular/core';
import { Character } from '../../Interface/character';

@Component({
  selector: 'card-character',
  templateUrl: './card-character.component.html',
  styleUrl: './card-character.component.scss',

})
export class CardCharacterComponent {
  characters = input<Character[]>([]);
  loading = input<boolean>(false);

  isLoading = computed(() => this.loading());
}
