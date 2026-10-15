import { Injectable, signal } from '@angular/core';

export interface Compra {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class CompraService {
  readonly compra = signal<Compra | null>(null);

  guardar(compra: Compra): void {
    this.compra.set(compra);
  }

  limpiar(): void {
    this.compra.set(null);
  }
}
