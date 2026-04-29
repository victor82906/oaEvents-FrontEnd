import { RolOutputDto } from './rol';

export interface ValidadorInputDto {
  email: string;
  contrasena: string;
  nombre: string;
  telefono: string;
  dni: string;
}

export interface ValidadorOutputDto {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  rol: RolOutputDto;
  dni: string;
}
