import { RolOutputDto } from './rol';

export interface RecintoInputDto {
  email: string;
  contrasena: string;
  nombre: string;
  telefono: string;
  ubicacion: string;
  mapa: string;
}

export interface RecintoOutputDto {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  rol: RolOutputDto;
  ubicacion: string;
  mapa: string;
  zonas_id: number[];
}
