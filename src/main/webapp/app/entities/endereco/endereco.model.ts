import { IPerfilUser } from 'app/entities/perfil-user/perfil-user.model';

export interface IEndereco {
  id?: number;
  nome?: string | null;
  cep?: string;
  logradouro?: string | null;
  bairro?: string | null;
  numero?: string | null;
  cidade?: string | null;
  complemento?: string | null;
  perfilUser?: IPerfilUser | null;
}

export class Endereco implements IEndereco {
  constructor(
    public id?: number,
    public nome?: string | null,
    public cep?: string,
    public logradouro?: string | null,
    public bairro?: string | null,
    public numero?: string | null,
    public cidade?: string | null,
    public complemento?: string | null,
    public perfilUser?: IPerfilUser | null
  ) {}
}

export function getEnderecoIdentifier(endereco: IEndereco): number | undefined {
  return endereco.id;
}
