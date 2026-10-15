import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit, OnDestroy {
  mostrarBienvenida = signal(true);
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    // Pantalla con imagen visible incluso en Android 12+, donde el splash nativo es distinto.
    this.temporizador = setTimeout(() => { this.mostrarBienvenida.set(false); }, 1700);
  }

  ngOnDestroy(): void {
    if (this.temporizador) clearTimeout(this.temporizador);
  }
}
