import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDb {
  // Abrir la base de datos de la tienda
  abrirBaseDatos(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const solicitud = indexedDB.open('TiendaPC', 5);
      // Creacion de la base de datos y del object store
      solicitud.onupgradeneeded = () => {
        const db = solicitud.result;
        if (!db.objectStoreNames.contains('pedidos')) {
          db.createObjectStore('pedidos', {
            keyPath: 'codigo'
          });
        }   
        if (!db.objectStoreNames.contains('productos')) { //agregacion de productos 25-11-2026
          db.createObjectStore('productos', {
            keyPath: 'codigo'
          });
        }
        if (!db.objectStoreNames.contains('carrito')) { //carrito de compras
          db.createObjectStore('carrito', {
            keyPath: 'id'
        });
}
      };
      // Devolver la conexion cuando se abra correctamente
      solicitud.onsuccess = () => {
        resolve(solicitud.result);
      };
      solicitud.onerror = () => {
        reject(solicitud.error);
      };
    });
  }

    // Guardado de un pedido en la base de datos
    async guardarPedido(pedido: any): Promise<void> {
      const db = await this.abrirBaseDatos();

      return new Promise((resolve, reject) => {
        const transaccion = db.transaction('pedidos', 'readwrite');
        // Accede al almacén de pedidos
        const almacen = transaccion.objectStore('pedidos');
        almacen.add(pedido);
        transaccion.oncomplete = () => {
          resolve();
          db.close();
        };
        // Captura errores durante el almacenamiento
        transaccion.onerror = () => {
          reject(transaccion.error);
          db.close();
        };

      });
    }

    // Obtiene todos los pedidos almacenados en la base de datos
    async obtenerPedidos(): Promise<any[]> {
        const db = await this.abrirBaseDatos();

        return new Promise((resolve, reject) => {
        const transaccion = db.transaction('pedidos', 'readonly');
        // Accede al almacén de pedidos
        const almacen = transaccion.objectStore('pedidos');
        const solicitud = almacen.getAll();
        // Devolver los pedidos recuperados
        solicitud.onsuccess = () => {
            resolve(solicitud.result);
            db.close();
        };
        solicitud.onerror = () => {
            reject(solicitud.error);
            db.close();
        };
        });
    }
    // actualiza un pedido existente en la base de datos
    async actualizarPedido(pedido: any): Promise<void> {
        const db = await this.abrirBaseDatos();

        return new Promise((resolve, reject) => {
        const transaccion = db.transaction('pedidos', 'readwrite');
        const almacen = transaccion.objectStore('pedidos');
        almacen.put(pedido);
        transaccion.oncomplete = () => {
            resolve();
            db.close();
        };
        transaccion.onerror = () => {
            reject(transaccion.error);
            db.close();
        };
        });
    }


    // Sesscion de guardado de los productos en la base de datos
    async guardarProductos(productos: any[]): Promise<void> {
      const db = await this.abrirBaseDatos();

      return new Promise((resolve, reject) => {
        const transaccion = db.transaction('productos', 'readwrite');
        const almacen = transaccion.objectStore('productos');

        productos.forEach(producto => almacen.put(producto));

        transaccion.oncomplete = () => {
          resolve();
          db.close();
        };

        transaccion.onerror = () => {
          reject(transaccion.error);
          db.close();
        };
      });
    }

    // Obtiene todos los productos almacenados
    async obtenerProductos(): Promise<any[]> {
      const db = await this.abrirBaseDatos();

      return new Promise((resolve, reject) => {
        const transaccion = db.transaction('productos', 'readonly');
        const almacen = transaccion.objectStore('productos');
        const solicitud = almacen.getAll();

        solicitud.onsuccess = () => {
          resolve(solicitud.result);
          db.close();
        };

        solicitud.onerror = () => {
          reject(solicitud.error);
          db.close();
        };
      });
    }

    // Actualiza un producto existente
    async actualizarProducto(producto: any): Promise<void> {
      const db = await this.abrirBaseDatos();

      return new Promise((resolve, reject) => {
        const transaccion = db.transaction('productos', 'readwrite');
        const almacen = transaccion.objectStore('productos');

        almacen.put(producto);

        transaccion.oncomplete = () => {
          resolve();
          db.close();
        };

        transaccion.onerror = () => {
          reject(transaccion.error);
          db.close();
        };
      });
    }

    // Guarda los productos y cantidades del carrito
    async guardarCarrito(items: any[]): Promise<void> {
      const db = await this.abrirBaseDatos();

      return new Promise((resolve, reject) => {
        const transaccion = db.transaction('carrito', 'readwrite');
        const almacen = transaccion.objectStore('carrito');

        almacen.put({
          id: 'actual',
          items: items
        });

        transaccion.oncomplete = () => {
          resolve();
          db.close();
        };

        transaccion.onerror = () => {
          reject(transaccion.error);
          db.close();
        };
      });
    }

    // Obtiene los productos y cantidades guardados en el carrito
    async obtenerCarrito(): Promise<any[]> {
      const db = await this.abrirBaseDatos();

      return new Promise((resolve, reject) => {
        const transaccion = db.transaction('carrito', 'readonly');
        const almacen = transaccion.objectStore('carrito');
        const solicitud = almacen.get('actual');

        solicitud.onsuccess = () => {
          resolve(solicitud.result?.items ?? []);
          db.close();
        };

        solicitud.onerror = () => {
          reject(solicitud.error);
          db.close();
        };
      });
    }

}
