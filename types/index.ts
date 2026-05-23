export type MaterialStatus = "available" | "in_use";

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  supplier: string;
  status: MaterialStatus;
  createdAt: string;
}

export type StockType = "IN" | "OUT";

export interface Stock {
  id: string;
  material: string;
  type: StockType;
  quantity: number;
  remaining: number;
  location: string;
  date: string;
}

export type DemandeStatus = "pending" | "approved" | "rejected";

export interface Demande {
  id: string;
  requester: string;
  chantier: string;
  material: string;
  quantity: number;
  status: DemandeStatus;
  date: string;
}
