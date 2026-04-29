import { RolOutputDto } from './rol';

export interface CompradorInputDto {
  email: string;
  contrasena: string;
  nombre: string;
  telefono: string;
  dni: string;
  apellidos: string;
}

export interface CompradorOutputDto {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  rol: RolOutputDto;
  dni: string;
  apellidos: string;
  entradas_id: number[];
}
