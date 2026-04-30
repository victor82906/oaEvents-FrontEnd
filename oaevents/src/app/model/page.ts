export interface Page<T> {
  content: T[];          // Aquí viene tu array de datos reales
  totalElements: number;
  totalPages: number;  // para mostrar pagina n de totalPages
  first: boolean; // si es true deshabilito el boton anterior
  last: boolean;  // si es true deshabilito el boton posterior
  size: number;
  number: number; // la página actual
  numberOfElements: number;
  empty: boolean;
}
