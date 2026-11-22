import { Component, input, output } from '@angular/core';
import { Producto } from '../../modelos/producto';
import { CurrencyPipe, UpperCasePipe} from '@angular/common';

@Component({
  imports: [CurrencyPipe, UpperCasePipe],
  selector: 'app-tarjeta-producto',
  styleUrl: './tarjeta-producto.css',
  templateUrl: './tarjeta-producto.html',
})
export class TarjetaProducto {

  // Recibe el objeto completo del producto desde el componente padre
  producto = input.required<Producto>();

  // Envía el producto seleccionado al componente padre
  agregar = output<Producto>();

  agregarProducto() : void { 
    const seleccionado = this.producto();

    if (seleccionado.stock > 0) {
      this.agregar.emit(seleccionado);
    }

  }

}
