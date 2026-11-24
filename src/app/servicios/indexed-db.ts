
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDb {
  // Abrir o crear la base de datos de la tienda
  abrirBaseDatos(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const solicitud = indexedDB.open('TiendaPC', 1);
      // Creacion de la base de datos y del object store
      solicitud.onupgradeneeded = () => {
        const db = solicitud.result;
        if (!db.objectStoreNames.contains('pedidos')) {
          db.createObjectStore('pedidos', {
            keyPath: 'codigo'
          });
        }
      };
      // Devolver la conexión cuando se abra correctamente
      solicitud.onsuccess = () => {
        resolve(solicitud.result);
      };
      solicitud.onerror = () => {
        reject(solicitud.error);
      };
    });
  }

  // Guarda un pedido en la base de datos
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

}
