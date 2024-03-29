import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey:string = "Qh9O0mYpqgg08gUMg7Ups0ofZ2GjpVtk";
  private _historial:string[] = [];
  private _servicioUrl = "https://api.giphy.com/v1/gifs"

  //TODO: cambiar any por su tipo correspondiente
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http:HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem(`resultados`)!) || [];
  }

  buscarGifs( query:string = "") {
    query = query.trim().toLocaleLowerCase();
    if ( !this._historial.includes( query )) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial))
    }

    const params = new HttpParams().set('api_key', this.apiKey).set('limit', '10').set('q', query)

    this.http.get<SearchGifsResponse>(`${this._servicioUrl}/search`, {params}).subscribe( 
      (resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      }
    );
  }
}
