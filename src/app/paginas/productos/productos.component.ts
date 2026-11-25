import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Producto } from '../../modelos/producto';
import { TarjetaProducto } from '../../components/tarjeta-producto/tarjeta-producto';
import { TiendaService } from '../../servicios/tienda';

@Component({
  imports: [TarjetaProducto, RouterLink],
  selector: 'app-productos',
  styleUrl: './productos.component.css',
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  private tienda = inject(TiendaService);
  private route = inject(ActivatedRoute);

  get productos(): Producto[] {
    return this.tienda.productos;
  }

  carrito = this.tienda.carrito;
  cantidadCarrito = this.tienda.cantidadCarrito;
  totalCarrito = this.tienda.totalCarrito;
  carritoAbierto = signal(false);

  // Lista única de categorías para el desplegable del buscador
  todasCategorias = computed(() => {
    this.tienda.actualizacionCatalogo();
    return [...new Set(this.productos.map(p => p.categoria))];
  });

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

  // BUSCADOR Y FILTRO POR CATEGORÍA
  busqueda = signal('');
  categoriaSeleccionada = signal('');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const categoriaUrl = params['categoria'] || '';
      if (categoriaUrl) {
        this.categoriaSeleccionada.set(categoriaUrl);
        this.busqueda.set(categoriaUrl);
      }
    });
  }

  categoriasProductos = computed(() => {
    this.tienda.actualizacionCatalogo();

    const termino = this.busqueda().trim().toLowerCase();
    const catFiltro = this.categoriaSeleccionada().trim().toLowerCase();

    const filtrados = this.productos.filter(producto => {
      const coincideCategoria =
        !catFiltro || producto.categoria.toLowerCase() === catFiltro;

      const coincideTexto =
        !termino ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino);

      return coincideCategoria && coincideTexto;
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

  buscarProducto(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.busqueda.set(valor);

    // Si el usuario escribe algo distinto a la categoría seleccionada, libera el filtro estricto
    const coincideExacta = this.todasCategorias().find(
      c => c.toLowerCase() === valor.trim().toLowerCase()
    );
    this.categoriaSeleccionada.set(coincideExacta ?? '');
  }

  filtrarPorCategoria(event: Event): void {
    const categoria = (event.target as HTMLSelectElement).value;
    this.categoriaSeleccionada.set(categoria);
    this.busqueda.set(categoria);
  }

  limpiarBusqueda(): void {
    this.busqueda.set('');
    this.categoriaSeleccionada.set('');
  }

  agregarCompra(producto: Producto): void {
    this.tienda.agregarCompra(producto);
  }

  aumentarCantidad(codigo: number): void {
    this.tienda.aumentarCantidad(codigo);
  }

  reducirCantidad(codigo: number): void {
    this.tienda.reducirCantidad(codigo);
  }

  quitarProducto(codigo: number): void {
    this.tienda.quitarProducto(codigo);
  }

  vaciarCarrito(): void {
    this.tienda.vaciarCarrito();
  }

  abrirCarrito(): void {
    this.carritoAbierto.set(true);
  }

  cerrarCarrito(): void {
    this.carritoAbierto.set(false);
  }
}
