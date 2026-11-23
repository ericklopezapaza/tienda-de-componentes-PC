
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
      imagen: 'images/Procesador AMD.jpg'
    },

    {
      codigo: 2,
      nombre: 'Tarjeta gráfica RTX 4060',
      descripcion: 'Tarjeta gráfica NVIDIA de 8 GB.',
      precio: 3200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/tarjeta grafica.jpeg'
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

    {
      codigo: 5,
      nombre: 'ASUS TUF GAMING B550M-PLUS WIFI II',
      descripcion: 'MotherBoard (Tarjeta madre).',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/MotherB1.jpeg'
    },

    {
      codigo: 6,
      nombre: 'GIGABYTE B550M DS3H AC',
      descripcion: 'MotherBoard (Tarjeta madre).',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/MotherB2.jpeg'
    },

    {
      codigo: 7,
      nombre: 'ASUS PRIME A520M-K',
      descripcion: 'MotherBoard (Tarjeta madre).',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/MotherB3.jpeg'
    },

    {
      codigo: 8,
      nombre: 'TeamGroup T-Create DDR4 16GB 2666MT/s CL19',
      descripcion: 'paquete de dos memorias dedicadas en dual chanel .',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/RAM.jpeg'
    },

    {
      codigo: 9,
      nombre: 'Hiksemi Armor Blue DDR4 16GB (1x16GB) 3200MHz',
      descripcion: 'Memoria RAM de alta compatibilidad para equipos de gama media y alta.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/RAM2.jpeg'
    },

    {
      codigo: 10,
      nombre: 'Kingston FURY Beast DDR4 16GB',
      descripcion: 'Memoria Ram de 16GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/RAM3.jpeg'
    },

    {
      codigo: 11,
      nombre: 'Corsair Vengeance LPX DDR4 16GB (2x8GB) 3200MHz CL16',
      descripcion: 'Paquete que contiene 2 memorias RAM de 8GB C/U .',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/RAM4.jpeg'
    },

    {
      codigo: 12,
      nombre: 'Tarjeta Grafica RTx 5060',
      descripcion: 'Tarjeta gráfica NVIDIA de 12 GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/TG rtx 5060.png'
    },

    {
      codigo: 13,
      nombre: 'Procesador Intel@Core i9-13900k',
      descripcion: 'Procesador de 6 núcleos y 12 hilos de la marca intel.',
      precio: 1200,
      stock: 10,
      categoria: 'Procesadores',
      imagen: 'images/procesor intel core i9-13900k.jpeg'
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
