import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-delegado',
  standalone: true,
  imports: [HeaderComponent, RouterModule, FooterComponent],
  templateUrl: './delegado.component.html',
  styleUrl: './delegado.component.css'
})
export class DelegadoComponent {

}
