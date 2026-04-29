import { RolOutputDto } from './rol';

export interface EmpresaInputDto {
  email: string;
  contrasena: string;
  nombre: string;
  telefono: string;
  cif: string;
}

export interface EmpresaOutputDto {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  rol: RolOutputDto;
  cif: string;
  activa: boolean;
  eventos_id: number[];
}
