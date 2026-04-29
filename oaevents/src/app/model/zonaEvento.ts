export interface ZonaEventoInputDto {
  precio: number;
  habilitada: boolean;
  evento_id: number;
  zona_id: number;
}

export interface ZonaEventoOutputDto {
  id: number;
  precio: number;
  habilitada: boolean;
  evento_id: number;
  zona_id: number;
  entradas_id: number[];
}
