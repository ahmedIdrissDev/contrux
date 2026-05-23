"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TableSkeleton } from "@/components/ui/skeleton";
import { clsx } from "clsx";

export default function DemandePage() {
  const demandes = useQuery(api.requests.list);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 justify-between items-center border-l-4 border-brand-green pl-4">
        <div>
          <h1 className="heading-2 text-ink">Gestion des demandes</h1>
          <p className="body-md text-steel mt-2">Suivez les demandes de matériaux par chantier.</p>
        </div>
        <Link 
          href="/demande/create"
          className="button-primary flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nouvelle demande</span>
        </Link>
      </div>


      {demandes === undefined ? (
        <TableSkeleton cols={6} rows={8} />
      ) : demandes.length === 0 ? (
        <div className="card-base text-center text-steel">
          Aucune demande trouvée.
        </div>
      ) : (
        <div className="card-base p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] text-[16px] text-steel font-medium">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Chantier</th>
                <th className="px-6 py-4">Articles</th>
                <th className="px-6 py-4">Urgence</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((item) => (
                <tr key={item._id} className="text-sm hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-hairline)]">
                  <td className="px-6 py-4 text-ink font-medium capitalize">{item.type}</td>
                  <td className="px-6 py-4 text-steel">{item.chantier || "N/A"}</td>
                  <td className="px-6 py-4 text-steel">{item.articles?.length || 0} items</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[14px] uppercase tracking-wider",
                      item.urgency === "Urgent" ? "bg-red-50 text-red-600" : "bg-[var(--color-surface)] text-steel"
                    )}>
                      {item.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge-green-soft">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/demande/manage/${item._id}`}
                      className="button-secondary text-[12px] px-4 py-2"
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
