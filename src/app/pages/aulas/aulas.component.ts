import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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
  showCreateModal = false;
  loading = false;
  loadingPresencas = false;
  submitted = false;
  currentYear = new Date().getFullYear();

  // Variáveis de contexto para PDF
  disciplinaSelecionada: any;
  aulaSelecionada: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.carregarDisciplinas();
  }

  private initializeForm() {
    this.form = this.fb.group({
      disciplinaId: ['', Validators.required],
      tema: ['', [Validators.required, Validators.minLength(3)]],
      dataHora: ['', Validators.required],
      duracao: ['', [Validators.required, Validators.min(1)]],
      localizacao: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  private carregarDisciplinas() {
    const user = this.auth.getUserData();
    this.http
      .get(`https://backend-lista-de-presenca.onrender.com/api/disciplines/${user.universidadeId}/${user.turmaId}`)
      .subscribe({
        next: (res: any) => {
          this.disciplines = res;
          console.log('📚 Disciplinas carregadas:', res);
        },
        error: (err) => {
          console.error('❌ Erro ao carregar disciplinas:', err);
        },
      });
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.submitted = false;
    this.form.reset();
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.submitted = false;
    this.form.reset();
  }

  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeCreateModal();
    }
  }

  criarAula() {
    this.submitted = true;
    
    if (this.form.invalid) {
      this.scrollToFirstInvalidControl();
      return;
    }

    this.loading = true;
    const user = this.auth.getUserData();
    const body = {
      ...this.form.value,
      universidadeId: user.universidadeId,
      turmaId: user.turmaId,
    };

    this.http.post('https://backend-lista-de-presenca.onrender.com/api/classes', body).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.showCreateModal = false;
        this.qrCodeUrl = res.qrCode;
        this.submitted = false;
        this.form.reset();
        
        if (this.filtroDisciplinaId === body.disciplinaId) {
          this.carregarAulas();
        }
        console.log('✅ Aula criada com sucesso:', res);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Erro ao criar aula:', err);
      },
    });
  }

  private scrollToFirstInvalidControl() {
    const firstInvalidControl = document.querySelector('.border-red-500');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  carregarAulas() {
    const user = this.auth.getUserData();
    if (!this.filtroDisciplinaId) return;

    this.aulas = [];
    this.filtroAulaId = '';
    this.presencas = [];
    this.pesquisaFeita = false;

    const url = `https://backend-lista-de-presenca.onrender.com/api/classes/${user.universidadeId}/${user.turmaId}/${this.filtroDisciplinaId}`;
    
    this.http.get(url).subscribe({
      next: (res: any) => {
        this.aulas = res;
        console.log('📘 Aulas carregadas:', res);
      },
      error: (err) => {
        console.error('❌ Erro ao carregar aulas:', err);
      },
    });
  }

  baixarQRCode() {
    if (!this.qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = this.qrCodeUrl;
    link.download = 'qr-code-aula.png';
    link.click();
  }

  async compartilharQRCode() {
    if (!this.qrCodeUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'QR Code da Aula',
          text: 'Use este QR Code para marcar presença na aula.',
          url: window.location.origin, // Corrige erro de URL inválida
        });
        console.log('✅ QR Code compartilhado com sucesso!');
      } else {
        await navigator.clipboard.writeText(this.qrCodeUrl);
        alert('📋 Link do QR Code copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Erro ao compartilhar QR Code:', err);
    }
  }

  buscarPresencas() {
    this.submitted = true;
    
    if (!this.filtroDisciplinaId || !this.filtroAulaId) {
      return;
    }

    this.loadingPresencas = true;
    const user = this.auth.getUserData();

    const url = `https://backend-lista-de-presenca.onrender.com/api/presence/${user.universidadeId}/${user.turmaId}/${this.filtroDisciplinaId}/${this.filtroAulaId}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        this.presencas = res;
        this.pesquisaFeita = true;
        this.loadingPresencas = false;

        this.disciplinaSelecionada = this.disciplines.find(d => d.id === this.filtroDisciplinaId);
        this.aulaSelecionada = this.aulas.find(a => a.id === this.filtroAulaId);

        console.log('✅ Presenças encontradas:', res);
      },
      error: (err) => {
        console.error('❌ Erro ao buscar presenças:', err);
        this.pesquisaFeita = true;
        this.loadingPresencas = false;
        this.presencas = [];
      },
    });
  }

  // ✅ Função para exportar presenças em PDF
  exportarPresencasPDF() {
    if (!this.presencas || this.presencas.length === 0) {
      alert('Nenhuma presença disponível para exportar.');
      return;
    }

    const doc = new jsPDF();

    const disciplina = this.disciplinaSelecionada?.nome || 'Disciplina não especificada';
    const aula = this.aulaSelecionada?.tema || 'Aula não especificada';
    const data = new Date().toLocaleDateString('pt-PT');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Relatório de Presenças', 14, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Disciplina: ${disciplina}`, 14, 30);
    doc.text(`Aula: ${aula}`, 14, 38);
    doc.text(`Data de geração: ${data}`, 14, 46);

    doc.line(14, 50, 196, 50);

    const tableData = this.presencas.map((p: any, i: number) => [
      i + 1,
      p.aluno?.nome || '—',
      p.aluno?.email || '—',
      p.aluno?.numeroEstudante || '—',
      new Date(p.hora?._seconds * 1000).toLocaleString('pt-PT'),
      p.presente ? 'Presente' : 'Ausente',
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['#', 'Aluno', 'Email', 'Nº Estudante', 'Hora do Registro', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 133, 244], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { fontSize: 10 },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(`© ${new Date().getFullYear()} Atlas Digital — Sistema Delegado`, 14, pageHeight - 10);

    doc.save(`presencas_${aula.replace(/\s+/g, '_')}.pdf`);
  }
}
