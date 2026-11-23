
import { Component, signal, computed, inject } from '@angular/core';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';
import { TiendaService } from '../../servicios/tienda';

@Component({
  imports: [TarjetaProducto],
  selector: 'app-productos',
  styleUrl: './productos.component.css',
  templateUrl: './productos.component.html',
})
export class ProductosComponent {

  // Acceder al servicio compartido de la tienda
  private tienda = inject(TiendaService);

  // Consultar el catálogo que administra el servicio
  get productos(): Producto[] {
    return this.tienda.productos;
  }

  // CARRITO DE COMPRAS

  // Utilizar el carrito compartido del servicio
  carrito = this.tienda.carrito;

  // Obtener la cantidad total de productos
  cantidadCarrito = this.tienda.cantidadCarrito;

  // Obtener el importe total de la compra
  totalCarrito = this.tienda.totalCarrito;

  // Mostrar u ocultar el carrito lateral
  carritoAbierto = signal(false);

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

  // FILTRAR Y AGRUPAR POR CATEGORÍAS

  categoriasProductos = computed(() => {

    // Detectar modificaciones en el stock desde el servicio
    this.tienda.actualizacionCatalogo();

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

  // AGREGAR PRODUCTOS AL CARRITO

  agregarCompra(producto: Producto): void {
    this.tienda.agregarCompra(producto);
  }

  // AUMENTAR CANTIDAD

  aumentarCantidad(codigo: number): void {
    this.tienda.aumentarCantidad(codigo);
  }

  // REDUCIR CANTIDAD

  reducirCantidad(codigo: number): void {
    this.tienda.reducirCantidad(codigo);
  }

  // ELIMINAR PRODUCTO COMPLETO

  quitarProducto(codigo: number): void {
    this.tienda.quitarProducto(codigo);
  }

  // VACIAR CARRITO

  vaciarCarrito(): void {
    this.tienda.vaciarCarrito();
  }

  // ABRIR Y CERRAR CARRITO

  abrirCarrito(): void {
    this.carritoAbierto.set(true);
  }

  cerrarCarrito(): void {
    this.carritoAbierto.set(false);
  }

}
