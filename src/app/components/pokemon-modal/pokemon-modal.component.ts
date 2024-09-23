import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonInfoResponse } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-modal',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-modal.component.html',
  styleUrl: './pokemon-modal.component.css',
})
export class PokemonModalComponent {
  @Input() pokemon: string | number = '';
  @Output() closeModal = new EventEmitter<void>();
  pokemonInfo: PokemonInfoResponse = {} as PokemonInfoResponse;
  displayName: string = '';
  displayWeight: string = '';
  displayHeight: string = '';
  displayID: string = '';
  types: string[] = [];
  displayTypes: string = '';
  private audio: HTMLAudioElement;

  constructor(private service: PokemonService) {
    this.audio = new Audio(
      'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg'
    );
  }

  ngOnInit() {
    this.service.getPokemonDetails(this.pokemon).subscribe((data) => {
      this.pokemonInfo = data;
      this.displayName =
        this.pokemonInfo.name.charAt(0).toUpperCase() +
        this.pokemonInfo.name.slice(1);
      this.displayWeight = this.numberToDecimalString(this.pokemonInfo.weight);
      this.displayHeight = this.numberToDecimalString(this.pokemonInfo.height);
      this.displayID = this.pokemonInfo.id.toString().padStart(4, '0');

      for (let i = 0; i < this.pokemonInfo.types.length; i++) {
        let type = this.pokemonInfo.types[i].type.name;
        type = type.charAt(0).toUpperCase() + type.slice(1);
        this.types.push(type);
      }
      this.displayTypes = this.types.join(', ');
    });
  }

  playAudio() {
    this.audio.play();
  }

  close() {
    this.closeModal.emit();
  }

  private numberToDecimalString(num: number): string {
    const numString = num.toString().padStart(2, '0');
    return numString.slice(0, numString.length - 1) + ',' + numString.slice(-1);
  }
}
