export interface EventoInputDto {
  titulo: string;
  descripcion: string;
  fecha: Date;
  tipoEvento_id: number;
  empresa_id: number;
}

export interface EventoOutputDto {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  aceptado: boolean;
  foto: string;
  tipoEvento_id: number;
  empresa_id: number;
  zonasEvento_id: number[];
}
