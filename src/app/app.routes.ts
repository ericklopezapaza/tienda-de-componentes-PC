import { Routes } from '@angular/router';
import { ProductosComponent } from './paginas/productos/productos.component';
import { CrearPedidoComponent } from './paginas/crear-pedido/crear-pedido.component';
import { HistorialPedidosComponent } from './paginas/historial-pedidos/historial-pedidos.component';
import { DetallePedidoComponent } from './paginas/detalle-pedido/detalle-pedido.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'productos',
        pathMatch: 'full'
    },

    {
        path: 'productos', 
        component: ProductosComponent,
        title: 'PRODUCTOS'
    },

    {
        path: 'pedidos/nuevo',
        component: CrearPedidoComponent,
        title: 'CREAR PEDIDO'
    },

    {
        path: 'pedidos',
        component: HistorialPedidosComponent,
        title: 'HISTORIAL DE PEDIDOS'
    },

    {
        path: 'pedidos/:codigo',
        component: DetallePedidoComponent,
        title: 'DETALLE DE PEDIDO'
    },

    {
        path:'**',
        redirectTo: 'productos'
    }
];    