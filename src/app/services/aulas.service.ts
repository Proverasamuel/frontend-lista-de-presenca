import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Aula } from '../models/aula.model';

@Injectable({ providedIn: 'root' })
export class AulasService {
  constructor(private api: ApiService) {}

  criarAula(aula: Aula): Observable<any> {
    return this.api.post('aulas', aula);
  }

  listarAulas(): Observable<Aula[]> {
    return this.api.get('aulas');
  }

  registrarPresenca(codigoAula: string, alunoId: string, nome: string): Observable<any> {
    return this.api.post(`aulas/${codigoAula}/presencas`, { alunoId, nome });
  }

  obterPorCodigo(codigoAula: string): Observable<Aula> {
    return this.api.get(`aulas/codigo/${codigoAula}`);
  }
}
