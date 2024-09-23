import { Component, Input } from '@angular/core';
import { PokemonBasicInfo } from '../../interfaces/pokemon.interface';
import { PokemonModalComponent } from '../pokemon-modal/pokemon-modal.component';

@Component({
  selector: 'app-pokemon-list-item',
  standalone: true,
  imports: [PokemonModalComponent],
  templateUrl: './pokemon-list-item.component.html',
  styleUrl: './pokemon-list-item.component.css',
})
export class PokemonListItemComponent {
  @Input() pokemon: PokemonBasicInfo = { name: '', url: '' };
  id: number = 0;
  idString: string = '';
  displayName: string = '';

  modalOpen: boolean = false;

  ngOnInit() {
    this.id = parseInt(this.pokemon.url.match(/\/(\d+)\/$/)?.[1] || '');
    this.idString = this.id.toString().padStart(4, '0');
    this.displayName =
      this.pokemon.name.charAt(0).toUpperCase() + this.pokemon.name.slice(1);
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }
}
