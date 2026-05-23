import { Box, ClipboardList, HardHat, Layers, PackagePlus, Settings } from "lucide-react";

export const SIDEBAR_NAV_ITEMS = [
  {
    label: "Material",
    href: "/material",
    icon: Box,
  },
  {
    label: "Stock",
    href: "/stock",
    icon: Layers,
  },
  {
    label: "Demande",
    href: "/demande",
    icon: ClipboardList,
  },
  {
    label: "Chantier",
    href: "/chantier",
    icon: HardHat,
  },
    {
    label: "Achat",
    href: "/achat",
    icon: PackagePlus,
  },
  {
    label: "Administration",
    href: "/administration",
    icon: Settings,
  },

];
