import { Routes } from '@angular/router';
import { ProductosComponent } from './paginas/productos/productos.component';
import { CrearPedidoComponent } from './paginas/crear-pedido/crear-pedido.component';
import { HistorialPedidosComponent } from './paginas/historial-pedidos/historial-pedidos.component';
import { DetallePedidoComponent } from './paginas/detalle-pedido/detalle-pedido.component';
import { InicioComponent } from './paginas/inicio/inicio.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'inicio',
        pathMatch: 'full'
    },

    {
        path: 'inicio',
        component: InicioComponent,
        title: 'INICIO'
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