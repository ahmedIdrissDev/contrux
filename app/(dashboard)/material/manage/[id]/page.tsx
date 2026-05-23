"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { Save, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function ManageMaterialSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      <div className="flex items-center gap-4 border-l-4 border-[var(--color-brand-green)] pl-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
      </div>
      <div className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] p-8 rounded-[var(--radius-lg)] space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2 space-y-2">
            <Skeleton className="h-3 w-32 rounded-sm" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
        <div className="flex gap-4 pt-8 border-t border-[var(--color-hairline)]">
          <Skeleton className="h-12 w-64 rounded-full" />
          <Skeleton className="h-12 w-32 ml-auto rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function ManageMaterialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"materials">;

  const material = useQuery(api.materials.getById, { id });
  const suppliers = useQuery(api.suppliers.list);
  const sites = useQuery(api.chantiers.list);
  
  const updateMaterial = useMutation(api.materials.update);
  const removeMaterial = useMutation(api.materials.remove);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    quantity: 0,
    status: "" as any,
    purchaseDate: "",
    notes: "",
    supplierId: "" as any,
    chantierId: "" as any,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        code: material.code,
        category: material.category,
        quantity: material.quantity,
        status: material.status,
        purchaseDate: material.purchaseDate,
        notes: material.notes || "",
        supplierId: material.supplierId || "",
        chantierId: material.chantierId || "",
      });
    }
  }, [material]);

  if (material === undefined) {
    return <ManageMaterialSkeleton />;
  }

  if (material === null) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-6">
        <AlertCircle className="w-16 h-16 text-red-600" />
        <h1 className="heading-1 text-ink">Matériel non trouvé</h1>
        <Link href="/material" className="button-secondary mt-4">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateMaterial({
        id,
        name: formData.name,
        code: formData.code,
        category: formData.category,
        quantity: formData.quantity,
        status: formData.status,
        purchaseDate: formData.purchaseDate,
        notes: formData.notes || undefined,
        supplierId: formData.supplierId === "" ? undefined : formData.supplierId as Id<"suppliers">,
        chantierId: formData.chantierId === "" ? undefined : formData.chantierId as Id<"chantierSites">,
      });
      alert("Matériel mis à jour avec succès.");
    } catch (error) {
      console.error("Failed to update material:", error);
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce matériel ? Cette action est irréversible.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await removeMaterial({ id });
      router.push("/material");
    } catch (error) {
      console.error("Failed to delete material:", error);
      alert("Erreur lors de la suppression.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center gap-4 border-l-4 border-[var(--color-brand-green)] pl-4">
        <div>
          <h1 className="heading-2 text-ink">Gérer le matériel</h1>
          <p className="body-md text-steel mt-2">Modifiez les informations ou supprimez le matériel de l'inventaire.</p>
        </div>
      </div>

      <div className="card-base">
        <form onSubmit={handleUpdate} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Nom du matériel</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Code</label>
              <input 
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="text-input w-full"
              />
            </div>

            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Catégorie</label>
              <input 
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="text-input w-full"
              />
            </div>

            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Quantité</label>
              <input 
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="text-input w-full"
              />
            </div>

            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Statut</label>
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

            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Date d'achat</label>
              <input 
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="text-input w-full"
              />
            </div>

            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Fournisseur</label>
              <select 
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="text-input w-full appearance-none"
              >
                <option value="">Sélectionner un fournisseur</option>
                {suppliers?.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Chantier (Affectation)</label>
              <select 
                value={formData.chantierId}
                onChange={(e) => setFormData({ ...formData, chantierId: e.target.value })}
                className="text-input w-full appearance-none"
              >
                <option value="">Non affecté</option>
                {sites?.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Notes</label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="text-input w-full min-h-[120px] py-3"
                placeholder="Informations complémentaires..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-8 border-t border-[var(--color-hairline)]">
            <button 
              type="submit"
              disabled={isSubmitting || isDeleting}
              className="button-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
            <button 
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="button-secondary flex items-center gap-2 ml-auto !bg-red-50 !text-red-600 !border-red-100 hover:!bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
