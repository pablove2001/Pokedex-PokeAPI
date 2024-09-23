import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  PokemonListResponse,
  PokemonBasicInfo,
  PokemonInfoResponse,
} from '../interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonBasicInfo(
    limit: number = 24,
    offset: number = 0
  ): Observable<PokemonBasicInfo[]> {
    return this.http
      .get<PokemonListResponse>(
        `${this.apiUrl}?limit=${limit}&offset=${offset}`
      )
      .pipe(map((response: PokemonListResponse) => response.results));
  }

  getPokemonListResponse(
    limit: number = 24,
    offset: number = 0
  ): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}?limit=${limit}&offset=${offset}`
    );
  }

  getPokemonDetails(id: number | string): Observable<PokemonInfoResponse> {
    return this.http.get<PokemonInfoResponse>(`${this.apiUrl}/${id}`);
  }
}
