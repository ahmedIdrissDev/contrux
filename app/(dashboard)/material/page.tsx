"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Plus, X } from "lucide-react";
import { useState } from "react";
import { TableSkeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { clsx } from "clsx";

export default function MaterialPage() {
  const materials = useQuery(api.materials.list);
  const createMaterial = useMutation(api.materials.create);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    quantity: 1,
    status: "Disponible" as const,
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const filteredMaterials = materials?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMaterial({
        name: formData.name,
        code: formData.code,
        category: formData.category,
        quantity: formData.quantity,
        status: formData.status,
        purchaseDate: formData.purchaseDate,
      });
      setIsModalOpen(false);
      setFormData({
        name: "",
        code: "",
        category: "",
        quantity: 1,
        status: "Disponible",
        purchaseDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error("Failed to create material:", error);
      alert("Une erreur est survenue lors de la création du matériel.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4 justify-between items-center border-l-4 border-[var(--color-brand-green)] pl-4">
        <div>
          <h1 className="heading-2 text-ink">Gestion du matériel</h1>
          <p className="body-md text-steel mt-2">Gérez votre inventaire de matériaux de construction.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="button-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau matériel
        </button>
      </div>

      <div className="search-pill">
        <Search className="w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher par nom, code ou catégorie..."
          className="flex-1 outline-none bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {materials === undefined ? (
        <TableSkeleton cols={6} rows={8} />
      ) : filteredMaterials?.length === 0 ? (
        <div className="card-base text-center body-md text-steel">
          Aucun matériel trouvé.
        </div>
      ) : (
        <div className="card-base p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] text-[16px] text-steel font-medium">
              <tr>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Quantité</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)]">
              {filteredMaterials?.map((item) => (
                <tr key={item._id} className="text-sm hover:bg-[var(--color-surface)] transition-colors">
                  <td className="px-6 py-4 text-ink font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-steel font-mono text-[14px] uppercase tracking-widest">{item.code}</td>
                  <td className="px-6 py-4 text-steel">{item.category}</td>
                  <td className="px-6 py-4 text-ink font-medium">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      item.status === "Disponible" ? "badge-green-soft" : "px-3 py-1 rounded-full text-[14px] uppercase tracking-wider bg-[var(--color-surface)] text-steel"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/material/manage/${item._id}`}
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
          <div className="dialog-content max-w-[640px]">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="heading-3 mb-8 text-ink">Nouveau matériel</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-stone font-medium mb-1.5 text-xs">Nom du matériel</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-input w-full"
                  placeholder="Ex: Pelle hydraulique CAT 320"
                />
              </div>
              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Code</label>
                <input 
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="text-input w-full"
                  placeholder="Ex: MAT-001"
                />
              </div>
              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Catégorie</label>
                <input 
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="text-input w-full"
                  placeholder="Ex: Engins"
                />
              </div>
              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Quantité</label>
                <input 
                  type="number"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="text-input w-full"
                />
              </div>
              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Date d'achat</label>
                <input 
                  type="date"
                  required
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="text-input w-full"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-stone font-medium mb-1.5 text-xs">Statut</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="text-input w-full appearance-none"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En utilisation">En utilisation</option>
                  <option value="En maintenance">En maintenance</option>
                  <option value="Hors service">Hors service</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-end mt-4 gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="button-secondary flex-1">Annuler</button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary flex-1"
                >
                  {isSubmitting ? "Création..." : "Créer le matériel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
