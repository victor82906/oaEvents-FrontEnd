export interface LocalidadInputDto {
  fila: string;
  numero: string;
  posX: number;
  posY: number;
  zona_id: number;
}

export interface LocalidadOutputDto {
  id: number;
  fila: string;
  numero: string;
  posX: number;
  posY: number;
  zona_id: number;
  entradas_id: number[];
}
