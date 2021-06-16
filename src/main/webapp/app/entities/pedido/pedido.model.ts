import * as dayjs from 'dayjs';
import { IPerfilUser } from 'app/entities/perfil-user/perfil-user.model';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { AndamentoPedido } from 'app/entities/enumerations/andamento-pedido.model';

export interface IPedido {
  id?: number;
  efetuado?: dayjs.Dayjs | null;
  status?: AndamentoPedido | null;
  precoTotal?: number | null;
  comentarios?: string | null;
  codigoPagamento?: string | null;
  perfilUser?: IPerfilUser | null;
  endereco?: IEndereco | null;
}

export class Pedido implements IPedido {
  constructor(
    public id?: number,
    public efetuado?: dayjs.Dayjs | null,
    public status?: AndamentoPedido | null,
    public precoTotal?: number | null,
    public comentarios?: string | null,
    public codigoPagamento?: string | null,
    public perfilUser?: IPerfilUser | null,
    public endereco?: IEndereco | null
  ) {}
}

export function getPedidoIdentifier(pedido: IPedido): number | undefined {
  return pedido.id;
}
