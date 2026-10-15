import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent } from '@ionic/angular';
import { CompraService } from '../services/compra.service';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonButton],
})
export class Tab1Page {
  private readonly servicio = inject(CompraService);
  private readonly router = inject(Router);

  nombreProducto = '';
  cantidad: number | null = 1;
  precioUnitario: number | null = null;
  error = '';

  get subtotal(): number {
    const cantidad = Number(this.cantidad);
    const precio = Number(this.precioUnitario);
    if (!Number.isInteger(cantidad) || cantidad <= 0 || !Number.isFinite(precio) || precio <= 0) {
      return 0;
    }
    return this.redondear(cantidad * precio);
  }

  ionViewWillEnter(): void {
    if (!this.servicio.compra()) {
      this.limpiarFormulario();
    }
  }

  ajustarCantidad(diferencia: number): void {
    const actual = Number(this.cantidad);
    const nueva = (Number.isInteger(actual) ? actual : 1) + diferencia;
    this.cantidad = Math.max(1, nueva);
    this.error = '';
  }

  continuar(): void {
    this.error = '';
    const nombre = this.nombreProducto.trim();
    const cantidad = Number(this.cantidad);
    const precio = Number(this.precioUnitario);

    if (!nombre) {
      this.error = 'Ingresa el nombre del producto.';
      return;
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      this.error = 'La cantidad debe ser un número entero mayor que cero.';
      return;
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      this.error = 'El precio unitario debe ser mayor que cero.';
      return;
    }

    this.servicio.guardar({
      nombre,
      cantidad,
      precioUnitario: precio,
      subtotal: this.redondear(cantidad * precio),
    });
    void this.router.navigateByUrl('/tabs/tab2');
  }

  moneda(valor: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2,
    }).format(valor);
  }

  private limpiarFormulario(): void {
    this.nombreProducto = '';
    this.cantidad = 1;
    this.precioUnitario = null;
    this.error = '';
  }

  private redondear(numero: number): number {
    return Math.round((numero + Number.EPSILON) * 100) / 100;
  }
}
