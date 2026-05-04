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
  pista: boolean;
  recinto_id: number;
}
