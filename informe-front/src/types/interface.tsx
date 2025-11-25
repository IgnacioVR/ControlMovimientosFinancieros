export interface Movement {
  id?: string;
  fecha: Date;
  tipo: "CREDITO" | "DEBITO";
  monto: number;
  descripcion?: string;
}

export interface MonthlyReportData {
  total_creditos: number;
  total_debitos: number;
  balance: number;
}

export type MovementType = "CREDITO" | "DEBITO";
