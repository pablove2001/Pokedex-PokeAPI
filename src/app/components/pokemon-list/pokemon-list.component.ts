import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  PokemonBasicInfo,
  PokemonInfoResponse,
  PokemonListResponse,
} from '../../interfaces/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';
import { PokemonListItemComponent } from '../pokemon-list-item/pokemon-list-item.component';
import { map, switchMap } from 'rxjs';
import { PokemonModalComponent } from '../pokemon-modal/pokemon-modal.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    PokemonListItemComponent,
    PokemonModalComponent,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css',
})
export class PokemonListComponent {
  pokemons: PokemonBasicInfo[] = [];
  offset: number = 0;
  currentPage: number = 1;
  totalPokemons: number = 1302;
  maxPage: number = 55;

  modalOpen: boolean = false;
  searchPokemon: string = '';
  searchPokemonLowerCase: string = '';

  constructor(
    private service: PokemonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map((params) => +params['page'] || 1),
        switchMap((page) => {
          this.currentPage = page;
          this.offset = (this.currentPage - 1) * 24;
          return this.service.getPokemonListResponse(undefined, this.offset);
        })
      )
      .subscribe((data: PokemonListResponse) => {
        this.totalPokemons = data.count;
        this.maxPage = Math.ceil(this.totalPokemons / 24);
        this.pokemons = data.results;
      });
  }

  nextPage() {
    if (this.currentPage < this.maxPage) {
      this.router.navigate([], {
        queryParams: { page: this.currentPage + 1 },
      });
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.router.navigate([], {
        queryParams: { page: this.currentPage - 1 },
      });
    }
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.searchPokemon === '') {
      return;
    }

    this.searchPokemonLowerCase = this.searchPokemon.toLowerCase();

    this.service
      .getPokemonDetails(this.searchPokemonLowerCase)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Pokemon not found:', this.searchPokemonLowerCase);
          alert('Pokemon not found: ' + this.searchPokemon);
          return of(null);
        })
      )
      .subscribe((pokemonInfoResponse: PokemonInfoResponse | null) => {
        if (pokemonInfoResponse) {
          this.openModal();
        }
      });
  }
}
