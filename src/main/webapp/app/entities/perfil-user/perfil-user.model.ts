import * as dayjs from 'dayjs';

export interface IPerfilUser {
  id?: number;
  nome?: string;
  senha?: string;
  fotoUrl?: string | null;
  cpf?: string | null;
  dataNascimento?: dayjs.Dayjs | null;
  criado?: dayjs.Dayjs | null;
  email?: string | null;
  contato?: string | null;
}

export class PerfilUser implements IPerfilUser {
  constructor(
    public id?: number,
    public nome?: string,
    public senha?: string,
    public fotoUrl?: string | null,
    public cpf?: string | null,
    public dataNascimento?: dayjs.Dayjs | null,
    public criado?: dayjs.Dayjs | null,
    public email?: string | null,
    public contato?: string | null
  ) {}
}

export function getPerfilUserIdentifier(perfilUser: IPerfilUser): number | undefined {
  return perfilUser.id;
}
