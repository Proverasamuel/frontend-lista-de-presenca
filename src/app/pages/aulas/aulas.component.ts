import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  disciplines: any[] = [];
  aulas: any[] = [];
  presencas: any[] = [];
  form!: FormGroup;
  filtroDisciplinaId = '';
  filtroAulaId = '';
  pesquisaFeita = false;
  qrCodeUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService
  ) {}
  currentYear = new Date().getFullYear();
  ngOnInit() {
    this.form = this.fb.group({
      disciplinaId: ['', Validators.required],
      tema: ['', Validators.required],
      dataHora: ['', Validators.required],
      duracao: ['', Validators.required],
      localizacao: ['', Validators.required],
    });

    const user = this.auth.getUserData();

    // 🔹 Carregar disciplinas do utilizador
    this.http
      .get(`https://backend-lista-de-presenca.onrender.com/api/disciplines/${user.universidadeId}/${user.turmaId}`)
      .subscribe({
        next: (res: any) => (this.disciplines = res),
        error: (err) => console.error('Erro ao carregar disciplinas:', err),
      });
  }

  criarAula() {
    if (this.form.invalid) return;

    const user = this.auth.getUserData();
    const body = {
      ...this.form.value,
      universidadeId: user.universidadeId,
      turmaId: user.turmaId,
    };

    this.http.post('https://backend-lista-de-presenca.onrender.com/api/classes', body).subscribe({
      next: (res: any) => {
        alert('Aula criada com sucesso!');
        this.qrCodeUrl = res.qrCode;
      },
      error: (err) => console.error('Erro ao criar aula:', err),
    });
  }

  /** 🔄 Carrega as aulas da disciplina selecionada */
  carregarAulas() {
    const user = this.auth.getUserData();
    if (!this.filtroDisciplinaId) return;

    const url = `https://backend-lista-de-presenca.onrender.com/api/classes/${user.universidadeId}/${user.turmaId}/${this.filtroDisciplinaId}`;
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.aulas = res;
        console.log('📘 Aulas carregadas:', res);
      },
      error: (err) => console.error('Erro ao carregar aulas:', err),
    });
  }

  /** 👀 Busca presenças da aula selecionada */
  buscarPresencas() {
    const user = this.auth.getUserData();

    if (!this.filtroDisciplinaId || !this.filtroAulaId) {
      alert('Selecione disciplina e aula');
      return;
    }

    const url = `https://backend-lista-de-presenca.onrender.com/api/presence/${user.universidadeId}/${user.turmaId}/${this.filtroDisciplinaId}/${this.filtroAulaId}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        this.presencas = res;
        this.pesquisaFeita = true;
        console.log('✅ Presenças encontradas:', res);
      },
      error: (err) => {
        console.error('Erro ao buscar presenças:', err);
        this.pesquisaFeita = true;
      },
    });
  }
}
