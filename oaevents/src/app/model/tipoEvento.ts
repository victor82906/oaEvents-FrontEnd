export interface TipoEventoInputDto {
  nombre: string;
}

export interface TipoEventoOutputDto {
  id: number;
  nombre: string;
  eventos_id: number[];
}
