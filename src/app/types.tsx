export interface Formula {
    formula_id: number;
    formula_name: string | null;
    formula: string | null;
    creation_time?: Date | null;
    approved: number;
  }