import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { BrowserQRCodeReader } from '@zxing/browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presenca',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presenca.component.html',
  styleUrls: ['./presenca.component.css']
})
export class PresencaComponent implements OnInit, OnDestroy {
  scanning = false;
  message = '';
  showManualModal = false;
  manualCode = '';
  presencasRecentes: any[] = [];
  private scanner = new BrowserQRCodeReader();
  private mediaStream: MediaStream | null = null;

  constructor(private http: HttpClient, private auth: AuthService , private router: Router) {}

  ngOnInit() {
    this.carregarPresencasRecentes();
  }

  ngOnDestroy() {
    this.pararScanner();
  }

  async marcarPresenca() {
    if (this.scanning) {
      this.pararScanner();
      return;
    }

    this.message = '';
    this.scanning = true;

    try {
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        this.message = 'Nenhuma câmera detectada. Verifique as permissões do navegador.';
        this.scanning = false;
        return;
      }

      // Usa a câmera traseira se disponível, caso contrário usa a primeira câmera
      const deviceId = this.getCameraPreference(videoInputDevices);
      
      const result = await this.scanner.decodeOnceFromVideoDevice(
        deviceId,
        'video'
      );

      await this.processarQRCode(result.getText());
      
    } catch (error: any) {
      console.error('Erro no scanner:', error);
      this.handleScannerError(error);
    }
  }

  private getCameraPreference(devices: any[]): string {
    // Preferir câmera traseira
    const rearCamera = devices.find(device => 
      device.label.toLowerCase().includes('back') || 
      device.label.toLowerCase().includes('traseira') ||
      device.label.toLowerCase().includes('rear')
    );
    
    return rearCamera ? rearCamera.deviceId : devices[0].deviceId;
  }

  private async processarQRCode(qrData: string) {
    try {
      const data = JSON.parse(qrData);
      const user = this.auth.getUserData();

      const body = {
        aulaId: data.aulaId,
        token: data.token,
        alunoId: user.uid,
        universidadeId: data.universidadeId,
        turmaId: data.turmaId,
        disciplinaId: data.disciplinaId
      };

      await this.http.post(
        'https://backend-lista-de-presenca.onrender.com/api/presence',
        body
      ).toPromise();

      this.message = '✅ Presença marcada com sucesso!';
      this.carregarPresencasRecentes();
      
    } catch (error: any) {
      console.error('Erro ao processar QR Code:', error);
      
      if (error.status === 409) {
        this.message = '❌ Presença já registrada anteriormente para esta aula.';
      } else if (error.status === 400) {
        this.message = '❌ QR Code inválido ou expirado.';
      } else {
        this.message = '❌ Erro ao marcar presença. Tente novamente.';
      }
    } finally {
      this.scanning = false;
      this.pararScanner();
    }
  }

  private handleScannerError(error: any) {
    if (error.name === 'NotAllowedError') {
      this.message = 'Permissão de câmera negada. Por favor, permita o acesso à câmera.';
    } else if (error.name === 'NotFoundError') {
      this.message = 'Nenhuma câmera encontrada no dispositivo.';
    } else if (error.name === 'NotSupportedError') {
      this.message = 'Navegador não suporta acesso à câmera.';
    } else if (error.name === 'NotReadableError') {
      this.message = 'Câmera já está em uso por outra aplicação.';
    } else {
      this.message = '❌ Erro ao acessar a câmera. Verifique as permissões.';
    }
    
    this.scanning = false;
    this.pararScanner();
  }

  private pararScanner() {
    const video = document.getElementById('video') as HTMLVideoElement;
    if (video && video.srcObject) {
      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      video.srcObject = null;
    }
  }

  openManualEntry() {
    this.showManualModal = true;
    this.manualCode = '';
  }

  closeManualModal() {
    this.showManualModal = false;
    this.manualCode = '';
  }

  async submitManualCode() {
    if (!this.manualCode.trim()) {
      this.message = 'Por favor, insira um código válido.';
      return;
    }

    this.showManualModal = false;
    this.message = 'Processando código...';

    try {
      await this.processarQRCode(this.manualCode);
    } catch (error) {
      this.message = '❌ Código inválido. Verifique e tente novamente.';
    }
  }

  private carregarPresencasRecentes() {
    const user = this.auth.getUserData();
    
    // Simulação de presenças recentes - substituir pela chamada real à API
    this.presencasRecentes = [
      {
        disciplina: 'Matemática',
        tema: 'Cálculo Diferencial',
        data: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
      },
      {
        disciplina: 'Programação',
        tema: 'Introdução ao Angular',
        data: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 dia atrás
      },
      {
        disciplina: 'Banco de Dados',
        tema: 'Modelagem Relacional',
        data: new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 dias atrás
      }
    ];
  }

  // Método para limpar mensagens
  limparMensagem() {
    this.message = '';
  }

    logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}