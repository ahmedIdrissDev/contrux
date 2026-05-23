"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus, Search, X, ChevronRight } from "lucide-react";
import { useState } from "react";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import { clsx } from "clsx";

export default function StockPage() {
  const stockHistory = useQuery(api.stock.getHistory, {});
  const stockItems = useQuery(api.stock.list);
  const materials = useQuery(api.materials.list);
  const chantiers = useQuery(api.chantiers.list);
  const recordTransaction = useMutation(api.stock.recordTransaction);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    selectedItemId: "", 
    fromId: "", // Empty means Depot
    toId: "",   // Empty means Depot
    quantity: 1,
    notes: "",
  });

  const filteredHistory = stockHistory?.filter((item) =>
    item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.responsibleEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedItemId) return;
    if (formData.fromId === formData.toId) {
      alert("L'origine et la destination doivent être différentes.");
      return;
    }
    
    const [itemType, id] = formData.selectedItemId.split(":");
    
    // Determine type
    let type: "in" | "out" | "transfer" = "transfer";
    if (formData.fromId === "") type = "out"; // From Depot
    else if (formData.toId === "") type = "in"; // To Depot
    
    setIsSubmitting(true);
    try {
      await recordTransaction({
        stockItemId: itemType === "stockItem" ? id as Id<"stockItems"> : undefined,
        materialId: itemType === "material" ? id as Id<"materials"> : undefined,
        fromChantierId: formData.fromId === "" ? undefined : formData.fromId as Id<"chantierSites">,
        toChantierId: formData.toId === "" ? undefined : formData.toId as Id<"chantierSites">,
        type,
        quantity: formData.quantity,
        notes: formData.notes,
      });
      setIsModalOpen(false);
      setFormData({
        selectedItemId: "",
        fromId: "",
        toId: "",
        quantity: 1,
        notes: "",
      });
    } catch (error: any) {
      console.error("Failed to record transaction:", error);
      alert(error.message || "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allArticles = [
    ...(stockItems?.map(item => ({ id: `stockItem:${item._id}`, name: item.name, info: `${item.quantity} ${item.unit}`, category: "Consommable" })) || []),
    ...(materials?.map(m => ({ id: `material:${m._id}`, name: m.name, info: `${m.quantity} unité(s)`, category: "Équipement" })) || [])
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 justify-between items-center border-l-4 border-[var(--color-brand-green)] pl-4">
        <div>
          <h1 className="heading-2 text-ink">Flux des Ressources</h1>
          <p className="body-md text-steel">Suivez vos stocks et matériels : Origine → Destination.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="button-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau mouvement
        </button>
      </div>

      <div className="search-pill">
        <Search className="w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher par article, origine, destination ou notes..."
          className="flex-1 outline-none bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {stockHistory === undefined ? (
        <TableSkeleton cols={6} rows={8} />
      ) : filteredHistory?.length === 0 ? (
        <div className="card-base text-center body-md text-steel">
          Aucun mouvement trouvé.
        </div>
      ) : (
        <div className="card-base p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] text-[16px] text-steel font-medium">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Mouvement (Origine → Destination)</th>
                <th className="px-6 py-4 text-center">Quantité</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)]">
              {filteredHistory?.map((item) => (
                <tr key={item._id} className="text-sm hover:bg-[var(--color-surface)] transition-colors">
                  <td className="px-6 py-4 text-ink font-medium">{item.itemName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-steel">{item.fromName}</span>
                      <ChevronRight className="w-3 h-3 text-[var(--color-brand-green-dark)]" />
                      <span className="text-ink font-medium">{item.toName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[14px] uppercase tracking-wider",
                      item.type === 'in' ? "badge-green-soft" : 
                      item.type === 'out' ? "bg-red-50 text-red-600" : 
                      "bg-[var(--color-surface)] text-steel"
                    )}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-stone font-medium text-xs">
                      {item.responsibleEmail?.split('@')[0] || "Système"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-steel truncate max-w-[200px]">{item.notes}</td>
                  <td className="px-6 py-4 text-right text-stone text-[14px] uppercase tracking-widest">
                    {new Date(item.date).toLocaleDateString()}
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
            <h2 className="heading-3 mb-8 text-ink">Nouveau mouvement</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Article / Matériel</label>
                <select 
                  required
                  value={formData.selectedItemId}
                  onChange={(e) => setFormData({ ...formData, selectedItemId: e.target.value })}
                  className="text-input w-full appearance-none"
                >
                  <option value="">Sélectionner un article</option>
                  <optgroup label="Consommables">
                    {allArticles.filter(a => a.category === "Consommable").map((item) => (
                      <option key={item.id} value={item.id}>{item.name} ({item.info} dispo)</option>
                    ))}
                  </optgroup>
                  <optgroup label="Équipements">
                    {allArticles.filter(a => a.category === "Équipement").map((item) => (
                      <option key={item.id} value={item.id}>{item.name} ({item.info} dispo)</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-surface rounded-lg border border-hairline">
                <div>
                  <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Origine</label>
                  <select 
                    value={formData.fromId}
                    onChange={(e) => setFormData({ ...formData, fromId: e.target.value })}
                    className="text-input w-full appearance-none"
                  >
                    <option value="">Dépôt Central</option>
                    {chantiers?.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Destination</label>
                  <select 
                    value={formData.toId}
                    onChange={(e) => setFormData({ ...formData, toId: e.target.value })}
                    className="text-input w-full appearance-none"
                  >
                    <option value="">Dépôt Central</option>
                    {chantiers?.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Quantité à déplacer</label>
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
                <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Notes / Motif du transfert</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="text-input w-full min-h-[100px] py-3"
                  placeholder="Justification du mouvement..."
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="button-secondary flex-1"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !formData.selectedItemId}
                  className="button-primary flex-1"
                >
                  {isSubmitting ? "Traitement..." : "Valider"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
