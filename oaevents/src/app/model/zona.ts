export interface ZonaInputDto {
  numero: string;
  coordenadas: string;
  puertaEntrada: string;
  pista: boolean;
  recinto_id: number;
}

export interface ZonaOutputDto {
  id: number;
  numero: string;
  coordenadas: string;
  puertaEntrada: string;
  recinto_id: number;
  localidades_id: number[];
  zonaEventos_id: number[];
}
