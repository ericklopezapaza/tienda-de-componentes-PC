
import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../modelos/producto';
import { pedidos as Pedido } from '../modelos/pedidos';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})


export class TiendaService {

    pedidosRegistrados = signal<Pedido[]>([]); //almacena los pedidos que se van registrando
   
    //carrito de compras
    carrito = signal<ItemCarrito[]>([]);
    actualizacionCatalogo = signal(0);
    cantidadCarrito = computed(() =>
    this.carrito().reduce(
        (total, item) => total + item.cantidad,
        0
    )
    );

    totalCarrito = computed(() =>
    this.carrito().reduce(
        (total, item) =>
        total + item.producto.precio * item.cantidad,
        0
    )
    ); 

  productos: Producto[] = [

    {
      codigo: 1,
      nombre: 'Procesador AMD Ryzen 5 5600',
      descripcion: 'Procesador de 6 núcleos y 12 hilos.',
      precio: 1200,
      stock: 10,
      categoria: 'Procesadores',
      imagen: 'images/procesadores/Procesador AMD.jpg'
    },

    {
      codigo: 2,
      nombre: 'Tarjeta gráfica RTX 4060',
      descripcion: 'Tarjeta gráfica NVIDIA de 8 GB.',
      precio: 3200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/tarjetasgraficas/tarjeta grafica.jpeg'
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
      imagen: 'images/tarjetasgraficas/TG rtx 5070 Ti Edicion frieren.png'
    },

    {
      codigo: 5,
      nombre: 'ASUS TUF GAMING B550M-PLUS WIFI II',
      descripcion: 'MotherBoard (Tarjeta madre).',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/MotherB1.jpeg'
    },

    {
      codigo: 6,
      nombre: 'GIGABYTE B550M DS3H AC',
      descripcion: 'MotherBoard (Tarjeta madre).',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/MotherB2.jpeg'
    },

    {
      codigo: 7,
      nombre: 'ASUS PRIME A520M-K',
      descripcion: 'MotherBoard (Tarjeta madre).',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/MotherB3.jpeg'
    },

    {
      codigo: 8,
      nombre: 'TeamGroup T-Create DDR4 16GB 2666MT/s CL19',
      descripcion: 'Paquete de dos memorias dedicadas en dual channel.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/RAM.jpeg'
    },

    {
      codigo: 9,
      nombre: 'Hiksemi Armor Blue DDR4 16GB (1x16GB) 3200MHz',
      descripcion: 'Memoria RAM de alta compatibilidad para equipos de gama media y alta.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/RAM2.jpeg'
    },

    {
      codigo: 10,
      nombre: 'Kingston FURY Beast DDR4 16GB',
      descripcion: 'Memoria RAM de 16GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/RAM3.jpeg'
    },

    {
      codigo: 11,
      nombre: 'Corsair Vengeance LPX DDR4 16GB (2x8GB) 3200MHz CL16',
      descripcion: 'Paquete que contiene 2 memorias RAM de 8GB C/U.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/RAM4.jpeg'
    },

    {
      codigo: 12,
      nombre: 'Tarjeta Grafica RTx 5060',
      descripcion: 'Tarjeta gráfica NVIDIA de 12 GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/tarjetasgraficas/TG rtx 5060.png'
    },

    {
      codigo: 13,
      nombre: 'Procesador Intel@Core i9-13900k',
      descripcion: 'Procesador de 6 núcleos y 12 hilos de la marca intel.',
      precio: 1200,
      stock: 10,
      categoria: 'Procesadores',
      imagen: 'images/procesadores/procesor intel core i9-13900k.jpeg'
    }

  ];


  // metodo para modificar el catalogo
  private modificarStock(codigo: number, cambio: number): void {

    this.productos = this.productos.map(producto =>
      producto.codigo === codigo
        ? { ...producto, stock: producto.stock + cambio }
        : producto
    );

    const productoActualizado = this.productos.find(
      producto => producto.codigo === codigo
    );

    if (!productoActualizado) return;

    this.carrito.update(items =>
      items.map(item =>
        item.producto.codigo === codigo
          ? { ...item, producto: productoActualizado }
          : item
      )
    );
    this.actualizacionCatalogo.update(valor => valor + 1);
  }

  // AGREGAR PRODUCTOS AL CARRITO
  agregarCompra(producto: Producto): void {
    const productoCatalogo = this.productos.find(
      p => p.codigo === producto.codigo
    );
    if (!productoCatalogo || productoCatalogo.stock <= 0) return;
      this.modificarStock(producto.codigo, -1);
      const productoActualizado = this.productos.find(
        p => p.codigo === producto.codigo
    );

    if (!productoActualizado) return;
    const existente = this.carrito().find(
      item => item.producto.codigo === producto.codigo
    );

    if (existente) {
      this.carrito.update(items =>
        items.map(item =>
          item.producto.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      this.carrito.update(items => [
        ...items,
        {
          producto: productoActualizado,
          cantidad: 1
        }
      ]);
    }
  }

  // AUMENTAR CANTIDAD
  aumentarCantidad(codigo: number): void {

    const producto = this.productos.find(
      p => p.codigo === codigo
    );

    if (!producto || producto.stock <= 0) return;
    this.modificarStock(codigo, -1);
    this.carrito.update(items =>
      items.map(item =>
        item.producto.codigo === codigo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  }

  // REDUCIR CANTIDAD
  reducirCantidad(codigo: number): void {
    const item = this.carrito().find(
      item => item.producto.codigo === codigo
    );
    if (!item) return;
    this.modificarStock(codigo, 1);
    // Reducir cantidad o eliminar si llega a cero
    this.carrito.update(items =>
      items
        .map(item =>
          item.producto.codigo === codigo
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  }

  // ELIMINACION DEL PRODUCTO
  quitarProducto(codigo: number): void {
    const item = this.carrito().find(
      item => item.producto.codigo === codigo
    );

    if (!item) return;
    this.modificarStock(codigo, item.cantidad);
    this.carrito.update(items =>
      items.filter(item => item.producto.codigo !== codigo)
    );
  }

  // VACIAR CARRITO
  vaciarCarrito(): void {
    this.carrito().forEach(item => {
      this.modificarStock(item.producto.codigo, item.cantidad);
    });
    this.carrito.set([]);
  }


}
