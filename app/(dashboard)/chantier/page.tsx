"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MapPin, Plus, Search, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/ui/skeleton";
import { clsx } from "clsx";

export default function ChantierPage() {
  const chantiers = useQuery(api.chantiers.list);
  const createChantier = useMutation(api.chantiers.create);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "En cours",
  });

  const filteredChantiers = chantiers?.filter((c) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createChantier({
        name: formData.name,
        location: formData.location,
        status: formData.status,
      });
      setIsModalOpen(false);
      setFormData({ name: "", location: "", status: "En cours" });
    } catch (error) {
      console.error("Failed to create chantier:", error);
      alert("Une erreur est survenue lors de la création du chantier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 justify-between items-center border-l-4 border-[var(--color-brand-green)] pl-4">
        <div>
          <h1 className="heading-2 text-ink">Gestion des chantiers</h1>
          <p className="body-md text-steel mt-2">Suivez l&apos;état et les ressources de vos chantiers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="button-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau chantier
        </button>
      </div>

      <div className="search-pill">
        <Search className="w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un chantier..."
          className="flex-1 outline-none bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {chantiers === undefined ? (
        <TableSkeleton cols={6} rows={8} />
      ) : filteredChantiers?.length === 0 ? (
        <div className="card-base text-center body-md text-steel">
          Aucun chantier trouvé.
        </div>
      ) : (
        <div className="card-base p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] text-[16px] text-steel font-medium">
              <tr>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Localisation</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)]">
              {filteredChantiers?.map((chantier) => (
                <tr key={chantier._id} className="text-sm text-ink hover:bg-[var(--color-surface)] transition-colors">
                  <td className="px-6 py-4 font-medium">{chantier.name}</td>
                  <td className="px-6 py-4 text-steel flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-brand-green-dark)]" />
                    {chantier.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      chantier.status === "En cours" ? "badge-green-soft" : "px-3 py-1 rounded-full text-[14px] uppercase tracking-wider bg-[var(--color-surface)] text-steel"
                    )}>
                      {chantier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/chantier/manage/${chantier._id}`}
                      className="button-secondary !text-[12px] !px-4 !py-2"
                    >
                      Gérer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="heading-3 mb-8 text-ink">Nouveau chantier</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Nom du chantier</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-input w-full"
                  placeholder="Ex: Résidence Al-Moustakbal"
                />
              </div>
              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Localisation</label>
                <input 
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="text-input w-full"
                  placeholder="Ex: Casablanca, Maarif"
                />
              </div>
              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Statut initial</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="text-input w-full appearance-none"
                >
                  <option value="En cours">En cours</option>
                  <option value="En attente">En attente</option>
                  <option value="Terminé">Terminé</option>
                </select>
              </div>
              <div className="mt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="button-secondary flex-1">Annuler</button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary flex-1"
                >
                  {isSubmitting ? "Création..." : "Créer le chantier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
