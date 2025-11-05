export interface Presenca {
  alunoId: string;
  nome: string;
  hora: string;
  assinou: boolean;
}

export interface Aula {
  id?: string;
  universidadeId?: string; 
  turmaId?: string; 
  disciplinaId?: string;
  data: string;
  duracao: number; // duração em minutos
  localizacao: string;
  token: string;
    expiresAt:string;
  presencas?: Presenca[];
}
