import { RolOutputDto } from './rol';

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface UsuarioInputDto {
  email: string;
  contrasena: string;
  nombre: string;
  telefono: string;
  rol_id: number;
}

export interface UsuarioOutputDto {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  rol: RolOutputDto;
}

export interface CambiarContrasenaDto {
  contrasenaActual: string;
  contrasena: string;
}
