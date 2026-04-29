export interface CheckQrDto {
  evento_id: number;
  zonas_ids: number[];
  codigo: string;
}

export interface QrInputDto {
  codigo: string;
  foto: string;
}

export interface QrOutputDto {
  id: number;
  codigo: string;
  foto: string;
  usado: boolean;
  entrada_id: number;
}
