export interface ChatInputDto {
  mensaje: string;
  receptor_id: number;
}

export interface ChatOutputDto {
  id: number;
  mensaje: string;
  fecha: Date;
  emisor_id: number;
  receptor_id: number;
}
