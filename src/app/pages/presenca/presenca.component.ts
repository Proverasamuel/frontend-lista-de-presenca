import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { BrowserQRCodeReader } from '@zxing/browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-presenca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './presenca.component.html',
  styleUrls: ['./presenca.component.css']
})
export class PresencaComponent {
  scanning = false;
  message = '';
  scanner = new BrowserQRCodeReader();

  constructor(private http: HttpClient, private auth: AuthService) {}

  async marcarPresenca() {
    this.message = '';
    this.scanning = true;

    try {
      // 🔍 Agora é um método estático
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();

      if (videoInputDevices.length === 0) {
        this.message = 'Nenhuma câmera detectada.';
        this.scanning = false;
        return;
      }

      // Usa a primeira câmera encontrada
      const result = await this.scanner.decodeOnceFromVideoDevice(
        videoInputDevices[0].deviceId,
        'video'
      );

      // QR Code lido com sucesso
      const data = JSON.parse(result.getText());
      const user = this.auth.getUserData();

      const body = {
  aulaId: data.aulaId,
  token: data.token,
  alunoId: user.uid,
  universidadeId: data.universidadeId,  // <- importante
  turmaId: data.turmaId,               // <- importante
  disciplinaId: data.disciplinaId      // <- importante
};


      await this.http.post(
        'https://backend-lista-de-presenca.onrender.com/api/presence',
        body
      ).toPromise();

      this.message = '✅ Presença marcada com sucesso!';
    } catch (error) {
      console.error(error);
      this.message = '❌ Falha ao marcar presença. Verifique o QR Code.';
    } finally {
      this.scanning = false;
      // Não há mais método `reset()`, então apenas parámos o stream
      const video = document.getElementById('video') as HTMLVideoElement;
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }
}
