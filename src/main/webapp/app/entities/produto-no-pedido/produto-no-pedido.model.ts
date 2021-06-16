import * as dayjs from 'dayjs';
import { IProdutoEmEstoque } from 'app/entities/produto-em-estoque/produto-em-estoque.model';
import { IPedido } from 'app/entities/pedido/pedido.model';

export interface IProdutoNoPedido {
  id?: number;
  quantidade?: number | null;
  preco?: number | null;
  criado?: dayjs.Dayjs | null;
  produtoEmEstoque?: IProdutoEmEstoque | null;
  pedido?: IPedido | null;
}

export class ProdutoNoPedido implements IProdutoNoPedido {
  constructor(
    public id?: number,
    public quantidade?: number | null,
    public preco?: number | null,
    public criado?: dayjs.Dayjs | null,
    public produtoEmEstoque?: IProdutoEmEstoque | null,
    public pedido?: IPedido | null
  ) {}
}

export function getProdutoNoPedidoIdentifier(produtoNoPedido: IProdutoNoPedido): number | undefined {
  return produtoNoPedido.id;
}
