
import { Component, signal, computed } from '@angular/core';
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

  // Buscador
  busqueda = signal('');

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

    {
      codigo: 3,
      nombre: 'Memoria RAM Kingston Fury 16GB',
      descripcion: 'Memoria DDR4 de 3200 MHz.',
      precio: 2100,
      stock: 8,
      categoria: 'Memorias RAM',
      imagen: 'https://m.media-amazon.com/images/I/61Nu3Bh1+5L._AC_SL1500_.jpg'
    },

    {
      codigo: 4,
      nombre: 'Tarjeta gráfica RTX 5070 Ti Frieren edition',
      descripcion: 'Tarjeta gráfica NVIDIA de 8 GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/TG rtx 5070 Ti Edicion frieren.png'
    },

  ];

  // Filtrar productos y organizarlos por categorías
  categoriasProductos = computed(() => {

    const termino = this.busqueda().trim().toLowerCase();

    const filtrados = this.productos.filter(producto => {

      return (
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino)
      );

    });

    const categorias = [...new Set(
      filtrados.map(producto => producto.categoria)
    )];

    return categorias.map(categoria => ({

      nombre: categoria,

      productos: filtrados.filter(
        producto => producto.categoria === categoria
      )

    }));

  });

  // Actualizar buscador
  buscarProducto(event: Event): void {

    const valor = (event.target as HTMLInputElement).value;

    this.busqueda.set(valor);

  }

  // Agregar producto a la compra
  agregarCompra(producto: Producto): void {

    const productoCatalogo = this.productos.find(
      p => p.codigo === producto.codigo
    );

    if (productoCatalogo && productoCatalogo.stock > 0) {

      productoCatalogo.stock--;

      this.cantidad.set(this.cantidad() + 1);

      this.total.set(
        this.total() + productoCatalogo.precio
      );

      this.mensaje.set(
        'Agregaste: ' + productoCatalogo.nombre
      );

    } else {

      this.mensaje.set(
        'Producto agotado: ' + producto.nombre
      );

    }

  }

}
