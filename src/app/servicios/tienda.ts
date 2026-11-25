
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
      descripcion: 'Tarjeta gráfica NVIDIA de 12 GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/tarjetasgraficas/TG rtx 5070 Ti Edicion frieren.png'
    },
    {
      codigo: 5,
      nombre: 'Tarjeta Grafica RTx 5060',
      descripcion: 'Tarjeta gráfica NVIDIA de 12 GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/tarjetasgraficas/TG rtx 5060.png'
    },
    {
      codigo: 6,
      nombre: 'AMD Radeon RX 9060 XT',
      descripcion: 'Tarjeta gráfica de 8 GB GDDR6 de arquitectura RDNA 4 enfocada en 1080p/1440p.',
      precio: 8200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/tarjetasgraficas/AMD Radeon RX 9060 XT.jpeg'
    },
    {
      codigo: 7,
      nombre: 'AMD Radeon RX 6600',
      descripcion: 'Tarjeta gráfica de 8 GB GDDR6 ideal para jugar a 1080p con bajo consumo energético.',
      precio: 8200,
      stock: 5,
      categoria: 'Tarjetas gráficas',
      imagen: 'images/tarjetasgraficas/AMD Radeon RX 6600.png'
    },
    {
      codigo: 8,
      nombre: 'ASUS TUF GAMING B550M-PLUS WIFI II',
      descripcion: 'placa micro ATX con socket AM4 y memoria DDR4, pensada para procesadores AMD Ryzen series 5000, 4000 G y 3000 .',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/MotherB1.jpeg'
    },
    {
      codigo: 9,
      nombre: 'GIGABYTE B550M DS3H AC',
      descripcion: 'Placa Madre que combina socket AM4 (chipset B550) con Wi-Fi 802.11ac y Bluetooth 4.2 integrados en formato Micro-ATX.',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/MotherB2.jpeg'
    },
    {
      codigo: 10,
      nombre: 'ASUS PRIME A520M-K',
      descripcion: 'placa de entrada (gama básica) Micro-ATX para socket AM4 con conectividad PCIe 3.0.',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/MotherB3.jpeg'
    },
    {
      codigo: 11,
      nombre: 'Gigabyte B760M DS3H DDR4',
      descripcion: 'Placa Micro-ATX socket LGA 1700 (Intel) con soporte PCIe 4.0 y 4 ranuras RAM.',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/Gigabyte B760M DS3H DDR4.png'
    },
    {
      codigo: 12,
      nombre: 'MSI PRO B760M-P DDR4',
      descripcion: 'Placa Micro-ATX económica para procesadores Intel de 12.ª, 13.ª y 14.ª generación.',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/MSI PRO B760M-P DDR4.png'
    },
    {
      codigo: 13,
      nombre: 'ASUS Prime B550M-A AC',
      descripcion: 'Placa Micro-ATX socket AM4 (DDR4) con conectividad inalámbrica y disipador VRM.',
      precio: 8200,
      stock: 5,
      categoria: 'Placas madre',
      imagen: 'images/placasmadre/ASUS Prime B550M-A AC.jpg'
    },
    {
      codigo: 14,
      nombre: 'TeamGroup T-Create DDR4 16GB 2666MT/s CL19',
      descripcion: 'Paquete de dos memorias dedicadas en dual channel.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/RAM.jpeg'
    },
    {
      codigo: 15,
      nombre: 'Hiksemi Armor Blue DDR4 16GB (1x16GB) 3200MHz',
      descripcion: 'Memoria RAM de alta compatibilidad para equipos de gama media y alta.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/RAM2.jpeg'
    },
    {
      codigo: 16,
      nombre: 'Kingston FURY Beast DDR4 16GB',
      descripcion: 'Memoria RAM de 16GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/RAM3.jpeg'
    },
    {
      codigo: 17,
      nombre: 'Corsair Vengeance LPX DDR4 16GB (2x8GB) 3200MHz CL16',
      descripcion: 'Paquete que contiene 2 memorias RAM de 8GB C/U.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/RAM4.jpeg'
    },
    {
      codigo: 18,
      nombre: 'G.Skill Ripjaws S5 32GB (2x16GB)',
      descripcion: 'Tarjeta gráfica NVIDIA de 12 GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/G.Skill Ripjaws S5 32GB (2x16GB).jpg'
    },
    {
      codigo: 19,
      nombre: 'Crucial Pro 32GB (2x16GB)',
      descripcion: 'Tarjeta gráfica NVIDIA de 12 GB.',
      precio: 8200,
      stock: 5,
      categoria: 'Memorias RAM',
      imagen: 'images/memoriasRAM/Crucial Pro 32GB (2x16GB).jpeg'
    },
    {
      codigo: 20,
      nombre: 'Intel Core i5-12400F',
      descripcion: 'Procesador de 6 núcleos y 12 hilos con frecuencia turbo de hasta 4.4 GHz (Socket LGA 1700).',
      precio: 8200,
      stock: 5,
      categoria: 'Procesadores',
      imagen: 'images/procesadores/Intel Core i5-12400F.jpg'
    },
    {
      codigo: 21,
      nombre: 'Procesador Intel@Core i9-13900k',
      descripcion: 'Procesador de 6 núcleos y 12 hilos de la marca intel.',
      precio: 1200,
      stock: 10,
      categoria: 'Procesadores',
      imagen: 'images/procesadores/procesor intel core i9-13900k.jpeg'
    },
    {
      codigo: 22,
      nombre: 'AMD Ryzen 5 5500',
      descripcion: 'Procesador de 6 núcleos y 12 hilos con frecuencia boost de hasta 4.2 GHz (Socket AM4).',
      precio: 8200,
      stock: 5,
      categoria: 'Procesadores',
      imagen: 'images/procesadores/AMD Ryzen 5 5500.jpg'
    },
    {
      codigo: 23,
      nombre: 'Intel Core i5-13400F',
      descripcion: 'Procesador híbrido de 10 núcleos (6 P-cores + 4 E-cores) y 16 hilos.',
      precio: 8200,
      stock: 5,
      categoria: 'Procesadores',
      imagen: 'images/procesadores/Intel Core i5-13400F.jpg'
    },
    {
      codigo: 24,
      nombre: 'AMD Ryzen 7 5700X3D',
      descripcion: 'Procesador de 8 núcleos y 16 hilos con tecnología 3D V-Cache para máximo rendimiento en juegos.',
      precio: 8200,
      stock: 5,
      categoria: 'Procesadores',
      imagen: 'images/procesadores/AMD Ryzen 7 5700X3D.jpg'
    },
    {
      codigo: 25,
      nombre: 'Cooler Master MasterBox Q300L',
      descripcion: 'Gabinete Micro-ATX compacto y modular con filtros antipolvo magnéticos.',
      precio: 8200,
      stock: 5,
      categoria: 'Gabinete',
      imagen: 'images/gabinete/Cooler Master MasterBox Q300L.jpg'
    },
    {
      codigo: 26,
      nombre: 'Antec NX292',
      descripcion: 'Gabinete Mid-Tower económico con frontal mesh y 4 ventiladores incluidos.',
      precio: 8200,
      stock: 5,
      categoria: 'Gabinete',
      imagen: 'images/gabinete/Antec NX292.jpg'
    },
    {
      codigo: 27,
      nombre: 'NZXT H5 Flow',
      descripcion: 'Gabinete Mid-Tower ATX con ventilador inferior inclinado dedicado para enfriar la GPU.',
      precio: 8200,
      stock: 5,
      categoria: 'Gabinete',
      imagen: 'images/gabinete/NZXT H5 Flow.jpeg'
    },
    {
      codigo: 28,
      nombre: 'DeepCool CC560',
      descripcion: 'Gabinete Mid-Tower ATX con panel semi-mallado y 4 ventiladores preinstalados.',
      precio: 8200,
      stock: 5,
      categoria: 'Gabinete',
      imagen: 'images/gabinete/DeepCool CC560.jpeg'
    },
    {
      codigo: 29,
      nombre: 'Corsair 4000D Airflow',
      descripcion: 'Gabinete Mid-Tower ATX con excelente flujo de aire frontal y panel de vidrio templado.',
      precio: 8200,
      stock: 5,
      categoria: 'Gabinete',
      imagen: 'images/gabinete/Corsair 4000D Airflow.jpeg'
    },
    {
      codigo: 30,
      nombre: 'Montech Air 100 ARGB',
      descripcion: 'Gabinete Micro-ATX con panel frontal de malla (mesh) y 4 ventiladores ARGB incluidos.',
      precio: 8200,
      stock: 5,
      categoria: 'Gabinete',
      imagen: 'images/gabinete/Montech Air 100 ARGB.jpg'
    },
    {
      codigo: 31,
      nombre: 'ASRock Challenger CL-750G',
      descripcion: 'Fuente de 750W con certificación 80 Plus Gold y alta eficiencia energética.',
      precio: 8200,
      stock: 5,
      categoria: 'Fuente de poder',
      imagen: 'images/fuente/ASRock Challenger CL-750G.png'
    },
    {
      codigo: 32,
      nombre: 'XPG Pylon 650W',
      descripcion: 'Fuente de 650W con certificación 80 Plus Bronze y regulación de voltaje DC-to-DC.',
      precio: 8200,
      stock: 5,
      categoria: 'Fuente de poder',
      imagen: 'images/fuente/XPG Pylon 650W.jpeg'
    },
    {
      codigo: 33,
      nombre: 'Gigabyte P650B',
      descripcion: 'Fuente de 650W con certificación 80 Plus Bronze y condensadores japoneses principales.',
      precio: 8200,
      stock: 5,
      categoria: 'Fuente de poder',
      imagen: 'images/fuente/Gigabyte P650B.jpeg'
    },
    {
      codigo: 34,
      nombre: 'EVGA 600 BR',
      descripcion: 'Fuente de 600W con certificación 80 Plus Bronze y protecciones eléctricas completas.',
      precio: 1200,
      stock: 10,
      categoria: 'Fuente de poder',
      imagen: 'images/fuente/EVGA 600 BR.jpg'
    },
    {
      codigo: 35,
      nombre: 'Corsair CX650',
      descripcion: 'Fuente de 650W con certificación 80 Plus Bronze y ventilador silencioso de 120 mm.',
      precio: 3200,
      stock: 5,
      categoria: 'Fuente de poder',
      imagen: 'images/fuente/Corsair CX650.jpeg'
    },
    {
      codigo: 36,
      nombre: 'MSI MAG A650BN',
      descripcion: 'Fuente de 650W con certificación 80 Plus Bronze y soporte ATX 3.1.',
      precio: 2100,
      stock: 8,
      categoria: 'Fuente de poder',
      imagen: 'images/fuente/MSI MAG A650BN.jpg'
    },
    {
      codigo: 37,
      nombre: 'Samsung Odyssey G5 G55C',
      descripcion: 'Monitor curvo de 27" Quad HD (1440p) con panel VA y 165 Hz.',
      precio: 8200,
      stock: 5,
      categoria: 'Monitores',
      imagen: 'images/monitores/Samsung Odyssey G5 G55C.jpg'
    },
    {
      codigo: 38,
      nombre: 'Gigabyte M27Q',
      descripcion: 'Monitor de 27" Quad HD (1440p), panel IPS de 170 Hz y switch KVM integrado.',
      precio: 8200,
      stock: 5,
      categoria: 'Monitores',
      imagen: 'images/monitores/Gigabyte M27Q.jpg'
    },
    {
      codigo: 39,
      nombre: 'MSI G274QPF-QD',
      descripcion: 'Monitor de 27" Quad HD (1440p) con panel Rapid IPS, Quantum Dot y 170 Hz.',
      precio: 8200,
      stock: 5,
      categoria: 'Monitores',
      imagen: 'images/monitores/MSI G274QPF-QD.jpg'
    },
    {
      codigo: 40,
      nombre: 'LG UltraGear 24GS60F-B',
      descripcion: 'Monitor de 24" Full HD (1080p), panel IPS, 180 Hz y compatibilidad con G-Sync/FreeSync.',
      precio: 8200,
      stock: 5,
      categoria: 'Monitores',
      imagen: 'images/monitores/LG UltraGear 24GS60F-B.jpeg'
    },
    {
      codigo: 41,
      nombre: 'ASUS TUF Gaming VG249Q3A',
      descripcion: 'Monitor de 23.8" Full HD (1080p), panel Fast IPS, 180 Hz y 1 ms de respuesta.',
      precio: 8200,
      stock: 5,
      categoria: 'Monitores',
      imagen: 'images/monitores/ASUS TUF Gaming VG249Q3A.png'
    },
    {
      codigo: 42,
      nombre: 'AOC 24G4',
      descripcion: 'Monitor gaming de 24" Full HD (1080p) con panel Fast IPS y 180 Hz.',
      precio: 8200,
      stock: 5,
      categoria: 'Monitores',
      imagen: 'images/monitores/AOC 24G4.jpg'
    },
    {
      codigo: 43,
      nombre: 'Seagate Barracuda 2TB',
      descripcion: 'Disco duro mecánico (HDD) SATA de 3.5" a 7200 RPM para almacenamiento masivo.',
      precio: 8200,
      stock: 5,
      categoria: 'Almacenamiento',
      imagen: 'images/almacenamiento/Seagate Barracuda 2TB.jpg'
    },
    {
      codigo: 44,
      nombre: 'Kingston A400 480GB',
      descripcion: 'Unidad SSD SATA III de 2.5" ideal para revivir equipos antiguos.',
      precio: 8200,
      stock: 5,
      categoria: 'Almacenamiento',
      imagen: 'images/almacenamiento/Kingston A400 480GB.jpeg'
    },
    {
      codigo: 45,
      nombre: 'Patriot P400 Lite 1TB',
      descripcion: 'SSD M.2 NVMe PCIe 4.0 x4 con disipador de grafeno incluido.',
      precio: 8200,
      stock: 5,
      categoria: 'Almacenamiento',
      imagen: 'images/almacenamiento/Patriot P400 Lite 1TB.jpg'
    },
    {
      codigo: 46,
      nombre: 'Crucial P3 Plus 1TB',
      descripcion: 'SSD M.2 NVMe Gen4 con lectura de hasta 5,000 MB/s.',
      precio: 1200,
      stock: 10,
      categoria: 'Almacenamiento',
      imagen: 'images/almacenamiento/Crucial P3 Plus 1TB.jpg'
    },
    {
      codigo: 47,
      nombre: 'Western Digital Blue SN580 1TB',
      descripcion: 'SSD M.2 NVMe PCIe 4.0 con velocidad de 4,150 MB/s y baja temperatura.',
      precio: 8200,
      stock: 5,
      categoria: 'Almacenamiento',
      imagen: 'images/almacenamiento/Western Digital Blue SN580 1TB.jpg'
    },
    {
      codigo: 48,
      nombre: 'Kingston NV2 1TB',
      descripcion: 'SSD M.2 NVMe PCIe 4.0 con lectura de hasta 3,500 MB/s.',
      precio: 8200,
      stock: 5,
      categoria: 'Almacenamiento',
      imagen: 'images/almacenamiento/Kingston NV2 1TB.jpg'
    },
    {
      codigo: 49,
      nombre: 'Thermalright Peerless Assassin 120 SE',
      descripcion: 'Disipador de aire de doble torre con 6 heatpipes y dos ventiladores de 120 mm.',
      precio: 8200,
      stock: 5,
      categoria: 'Enfriamiento',
      imagen: 'images/enfriamiento/Thermalright Peerless Assassin 120 SE.jpg'
    },
    {
      codigo: 50,
      nombre: 'DeepCool AK400',
      descripcion: 'Disipador de aire tipo torre con 4 tubos de calor y capacidad de hasta 220W TDP.',
      precio: 8200,
      stock: 5,
      categoria: 'Enfriamiento',
      imagen: 'images/enfriamiento/DeepCool AK400.jpeg'
    },
    {
      codigo: 51,
      nombre: 'Cooler Master Hyper 212 Black Edition',
      descripcion: 'Disipador de aire clásico de 4 heatpipes con acabado anodizado negro.',
      precio: 8200,
      stock: 5,
      categoria: 'Enfriamiento',
      imagen: 'images/enfriamiento/Cooler Master Hyper 212 Black Edition.jpg'
    },
    {
      codigo: 52,
      nombre: 'ID-COOLING SE-214-XT ARGB',
      descripcion: 'Disipador de aire económico con iluminación ARGB y ventilador PWM de 120 mm.',
      precio: 8200,
      stock: 5,
      categoria: 'Enfriamiento',
      imagen: 'images/enfriamiento/ID-COOLING SE-214-XT ARGB.jpg'
    },
    {
      codigo: 53,
      nombre: 'ID-COOLING FX360 INF',
      descripcion: 'Refrigeración líquida todo en uno (AIO) de 360 mm con triple ventilador.',
      precio: 8200,
      stock: 5,
      categoria: 'Enfriamiento',
      imagen: 'images/enfriamiento/ID-COOLING FX360 INF.jpg'
    },
    {
      codigo: 54,
      nombre: 'Arctic Liquid Freezer III 240',
      descripcion: 'Refrigeración líquida AIO de 240 mm con ventilador integrado para los VRM de la placa.',
      precio: 8200,
      stock: 5,
      categoria: 'Enfriamiento',
      imagen: 'images/enfriamiento/Arctic Liquid Freezer III 240.png'
    }
  ];


  // metodo para modificar el stock del catalogo
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

  // devolver existencias de un pedido
  devolverExistencias(
    detalles: { codigodetalle: number; nombreProducto: string; precioUnitario: number; cantidad: number; subtotal: number }[]
  ): void {

    detalles.forEach(detalle => {
      const producto = this.productos.find(
        p => p.nombre === detalle.nombreProducto
      );
      if (producto) {
        this.modificarStock(producto.codigo, detalle.cantidad);
      }
    });
  }

  // agregar producto al carrito
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
