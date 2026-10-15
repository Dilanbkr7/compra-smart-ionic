import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular';
import { CompraService } from '../services/compra.service';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonButton],
})
export class Tab2Page {
  readonly servicio = inject(CompraService);
  private readonly router = inject(Router);

  descuento: number | null = 0;
  dineroRecibido: number | null = null;
  error = '';
  mostrarResultado = false;

  get subtotal(): number {
    return this.servicio.compra()?.subtotal ?? 0;
  }

  get descuentoMonto(): number {
    if (!this.descuentoValido()) return 0;
    return this.redondear(this.subtotal * Number(this.descuento) / 100);
  }

  get total(): number {
    return this.redondear(Math.max(0, this.subtotal - this.descuentoMonto));
  }

  get cambio(): number {
    return this.redondear(Math.max(0, Number(this.dineroRecibido) - this.total));
  }

  get pendiente(): number {
    return this.redondear(Math.max(0, this.total - Number(this.dineroRecibido)));
  }

  get estado(): 'cambio' | 'pendiente' | 'exacto' {
    if (this.cambio > 0) return 'cambio';
    if (this.pendiente > 0) return 'pendiente';
    return 'exacto';
  }

  ionViewWillEnter(): void {
    this.descuento = 0;
    this.dineroRecibido = null;
    this.mostrarResultado = false;
    this.error = '';
  }

  limpiarResultado(): void {
    this.error = '';
    this.mostrarResultado = false;
  }

  calcular(): void {
    this.error = '';
    this.mostrarResultado = false;

    if (!this.servicio.compra()) {
      this.error = 'Primero registra un producto en Compra.';
      return;
    }
    if (!this.descuentoValido()) {
      this.error = 'El descuento debe estar entre 0 y 100 %.';
      return;
    }
    if (this.dineroRecibido === null || this.dineroRecibido === undefined ||
        !Number.isFinite(Number(this.dineroRecibido)) || Number(this.dineroRecibido) < 0) {
      this.error = 'El dinero entregado debe ser mayor o igual a cero.';
      return;
    }
    this.mostrarResultado = true;
  }

  nuevaCompra(): void {
    this.servicio.limpiar();
    this.descuento = 0;
    this.dineroRecibido = null;
    this.mostrarResultado = false;
    void this.router.navigateByUrl('/tabs/tab1');
  }

  irACompra(): void {
    void this.router.navigateByUrl('/tabs/tab1');
  }

  moneda(valor: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2,
    }).format(valor);
  }

  private descuentoValido(): boolean {
    const valor = Number(this.descuento);
    return this.descuento !== null && this.descuento !== undefined &&
      Number.isFinite(valor) && valor >= 0 && valor <= 100;
  }

  private redondear(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }
}
