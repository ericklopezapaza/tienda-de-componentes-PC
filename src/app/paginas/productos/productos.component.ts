
import { Component, signal, computed } from '@angular/core';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';

// Interfaz para los productos del carrito
interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  imports: [TarjetaProducto],
  selector: 'app-productos',
  styleUrl: './productos.component.css',
  templateUrl: './productos.component.html',
})
export class ProductosComponent {

  // CARRITO DE COMPRAS

  carrito = signal<ItemCarrito[]>([]);

  // Mostrar u ocultar el carrito lateral
  carritoAbierto = signal(false);

  // Detectar cambios en el catálogo
  actualizacionCatalogo = signal(0);

  // Cantidad total de unidades en el carrito
  cantidadCarrito = computed(() =>
    this.carrito().reduce(
      (total, item) => total + item.cantidad,
      0
    )
  );

  // Total de la compra
  totalCarrito = computed(() =>
    this.carrito().reduce(
      (total, item) =>
        total + item.producto.precio * item.cantidad,
      0
    )
  );

  // CARRUSEL DE PRODUCTOS

  posiciones = signal<Record<string, number>>({});

  moverCarrusel(
    categoria: string,
    direccion: 'izquierda' | 'derecha'
  ): void {

    const contenedor = document.getElementById(
      'carrusel-' + categoria
    );

    if (!contenedor) return;

    const desplazamiento = contenedor.clientWidth * 0.8;

    contenedor.scrollBy({
      left: direccion === 'derecha'
        ? desplazamiento
        : -desplazamiento,
      behavior: 'smooth'
    });

    const actual = this.posiciones()[categoria] || 0;

    this.posiciones.update(posiciones => ({
      ...posiciones,
      [categoria]: Math.max(
        0,
        actual + (direccion === 'derecha' ? 1 : -1)
      )
    }));
  }

  // BUSCADOR

  busqueda = signal('');

  // LISTA DE PRODUCTOS

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
    },

  ];

  // FILTRAR Y AGRUPAR POR CATEGORÍAS

  categoriasProductos = computed(() => {

    // Detectar modificaciones en el stock
    this.actualizacionCatalogo();

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

  // ACTUALIZAR BUSCADOR

  buscarProducto(event: Event): void {

    const valor = (event.target as HTMLInputElement).value;

    this.busqueda.set(valor);

  }

  // ACTUALIZAR STOCK DEL CATÁLOGO

  private modificarStock(codigo: number, cambio: number): void {

    // Crear una nueva referencia del producto actualizado
    this.productos = this.productos.map(producto =>
      producto.codigo === codigo
        ? { ...producto, stock: producto.stock + cambio }
        : producto
    );

    const productoActualizado = this.productos.find(
      producto => producto.codigo === codigo
    );

    if (!productoActualizado) return;

    // Actualizar la referencia del producto en el carrito
    this.carrito.update(items =>
      items.map(item =>
        item.producto.codigo === codigo
          ? { ...item, producto: productoActualizado }
          : item
      )
    );

    // Notificar el cambio al catálogo
    this.actualizacionCatalogo.update(valor => valor + 1);
  }

  // AGREGAR PRODUCTOS AL CARRITO

  agregarCompra(producto: Producto): void {

    const productoCatalogo = this.productos.find(
      p => p.codigo === producto.codigo
    );

    if (!productoCatalogo || productoCatalogo.stock <= 0) {
      return;
    }

    // Descontar una unidad del stock
    this.modificarStock(producto.codigo, -1);

    const productoActualizado = this.productos.find(
      p => p.codigo === producto.codigo
    );

    if (!productoActualizado) return;

    const existente = this.carrito().find(
      item => item.producto.codigo === producto.codigo
    );

    if (existente) {

      // Aumentar la cantidad del producto existente
      this.carrito.update(items =>
        items.map(item =>
          item.producto.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );

    } else {

      // Agregar un nuevo producto
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

    if (!producto || producto.stock <= 0) {
      return;
    }

    // Descontar una unidad del stock
    this.modificarStock(codigo, -1);

    // Aumentar la cantidad en el carrito
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

    // Devolver una unidad al stock
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

  // ELIMINAR PRODUCTO COMPLETO

  quitarProducto(codigo: number): void {

    const item = this.carrito().find(
      item => item.producto.codigo === codigo
    );

    if (!item) return;

    // Devolver todas las unidades al stock
    this.modificarStock(codigo, item.cantidad);

    // Eliminar el producto del carrito
    this.carrito.update(items =>
      items.filter(item => item.producto.codigo !== codigo)
    );
  }

  // VACIAR CARRITO

  vaciarCarrito(): void {

    // Devolver todas las unidades al catálogo
    this.carrito().forEach(item => {
      this.modificarStock(item.producto.codigo, item.cantidad);
    });

    // Vaciar el carrito
    this.carrito.set([]);
  }

  // ABRIR Y CERRAR CARRITO

  abrirCarrito(): void {
    this.carritoAbierto.set(true);
  }

  cerrarCarrito(): void {
    this.carritoAbierto.set(false);
  }

}
