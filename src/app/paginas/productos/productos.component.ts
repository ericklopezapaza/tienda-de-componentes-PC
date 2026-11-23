import { Component, signal } from '@angular/core';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';

@Component({
  imports: [TarjetaProducto],
  selector: 'app-productos',
  styleUrl: './productos.component.css',
  templateUrl: './productos.component.html',
})
export class ProductosComponent {
  mensaje = signal('');
  cantidad = signal(0);
  total = signal(0);

  productos: Producto[] = [

    {
      codigo: 1,
      nombre: 'Procesador AMD Ryzen 5 5600',
      descripcion: 'Procesador de 6 núcleos y 12 hilos.',
      precio: 1200,
      stock: 10,
      categoria: 'Procesadores',
      imagen: 'https://m.media-amazon.com/images/W/BW_MEDIAX_AVIF_MEASUREMENT_1306696-T4/images/I/51So7GoGvxL._AC_SL1384_.jpg'
    },

    {
      codigo: 2,
      nombre: 'Tarjeta gráfica RTX 4060',
      descripcion: 'Tarjeta gráfica NVIDIA de 8 GB.',
      precio: 3200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'https://m.media-amazon.com/images/W/BW_MEDIAX_AVIF_MEASUREMENT_1306696-T4/images/I/71t1ClD2EtL._AC_SL1500_.jpg'
    },

  ];
  

  agregarCompra(producto: Producto): void {

  const productoCatalogo = this.productos.find(
    p => p.codigo === producto.codigo
  );

  if (productoCatalogo && productoCatalogo.stock > 0) {

    productoCatalogo.stock--;

    this.cantidad.set(this.cantidad() + 1);
    this.total.set(this.total() + productoCatalogo.precio);
    this.mensaje.set('Agregaste: ' + productoCatalogo.nombre);

  } else {

    this.mensaje.set('Producto agotado: ' + producto.nombre);
  }
}

}
