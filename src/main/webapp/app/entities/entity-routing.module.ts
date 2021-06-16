import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'perfil-user',
        data: { pageTitle: 'jhipsterSampleApplicationApp.perfilUser.home.title' },
        loadChildren: () => import('./perfil-user/perfil-user.module').then(m => m.PerfilUserModule),
      },
      {
        path: 'endereco',
        data: { pageTitle: 'jhipsterSampleApplicationApp.endereco.home.title' },
        loadChildren: () => import('./endereco/endereco.module').then(m => m.EnderecoModule),
      },
      {
        path: 'produto-em-estoque',
        data: { pageTitle: 'jhipsterSampleApplicationApp.produtoEmEstoque.home.title' },
        loadChildren: () => import('./produto-em-estoque/produto-em-estoque.module').then(m => m.ProdutoEmEstoqueModule),
      },
      {
        path: 'pedido',
        data: { pageTitle: 'jhipsterSampleApplicationApp.pedido.home.title' },
        loadChildren: () => import('./pedido/pedido.module').then(m => m.PedidoModule),
      },
      {
        path: 'produto-no-pedido',
        data: { pageTitle: 'jhipsterSampleApplicationApp.produtoNoPedido.home.title' },
        loadChildren: () => import('./produto-no-pedido/produto-no-pedido.module').then(m => m.ProdutoNoPedidoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
