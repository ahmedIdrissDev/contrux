import { Material, Stock, Demande } from "@/types";

export const materials: Material[] = [
  {
    id: "MAT-001",
    name: "Ciment CPJ 45",
    category: "Construction",
    unit: "Sac",
    quantity: 120,
    supplier: "Safi Cement",
    status: "available",
    createdAt: "2026-01-10",
  },
  {
    id: "MAT-002",
    name: "Sable fin",
    category: "Aggregate",
    unit: "Ton",
    quantity: 45,
    supplier: "Atlas Materials",
    status: "in_use",
    createdAt: "2026-01-12",
  },
  {
    id: "MAT-003",
    name: "Fer 12mm",
    category: "Steel",
    unit: "Bar",
    quantity: 300,
    supplier: "Steel Maroc",
    status: "available",
    createdAt: "2026-01-15",
  },
];

export const stock: Stock[] = [
  {
    id: "STK-001",
    material: "Ciment CPJ 45",
    type: "IN",
    quantity: 200,
    remaining: 120,
    location: "Warehouse A",
    date: "2026-02-01",
  },
  {
    id: "STK-002",
    material: "Sable fin",
    type: "OUT",
    quantity: 20,
    remaining: 45,
    location: "Chantier Casa",
    date: "2026-02-03",
  },
  {
    id: "STK-003",
    material: "Fer 12mm",
    type: "IN",
    quantity: 500,
    remaining: 300,
    location: "Warehouse B",
    date: "2026-02-05",
  },
];

export const demandes: Demande[] = [
  {
    id: "DEM-001",
    requester: "Ahmed Benali",
    chantier: "Chantier Casa Center",
    material: "Ciment CPJ 45",
    quantity: 20,
    status: "pending",
    date: "2026-02-10",
  },
  {
    id: "DEM-002",
    requester: "Youssef Karim",
    chantier: "Rabat Project",
    material: "Fer 12mm",
    quantity: 50,
    status: "approved",
    date: "2026-02-11",
  },
  {
    id: "DEM-003",
    requester: "Omar Tazi",
    chantier: "Marrakech Site",
    material: "Sable fin",
    quantity: 10,
    status: "rejected",
    date: "2026-02-12",
  },
];
