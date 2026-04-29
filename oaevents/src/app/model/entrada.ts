import { QrOutputDto } from './qr';

export interface EntradaInputDto {
  localidad_id: number;
  zonaEvento_id: number;
  comprador_id: number;
}

export interface EntradaOutputDto {
  id: number;
  fechaCompra: Date;
  fechaEvento: Date;
  nombreComprador: string;
  emailComprador: string;
  dniComprador: string;
  precio: number;
  localidad_id: number;
  zonaEvento_id: number;
  comprador_id: number;
  qr: QrOutputDto;
}

export interface EntradaCompraInputDto {
  localidad_ids: number[];
  zonaEvento_id: number;
  evento_id: number;
  tarjetaCredito: string;
  nombreComprador: string;
  emailComprador: string;
  dniComprador: string;
}

export interface EntradaCompraLogueadoInputDto {
  localidad_ids: number[];
  zonaEvento_id: number;
  evento_id: number;
  tarjetaCredito: string;
}
