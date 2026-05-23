"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { Save, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { clsx } from "clsx";

export function ManageChantierSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse">
      <div className="flex items-center gap-4">
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

export default function ManageChantierPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<"chantierSites">;

  const chantier = useQuery(api.chantiers.getById, { id });
  const materials = useQuery(api.materials.getByChantier, { chantierId: id });
  
  const updateChantier = useMutation(api.chantiers.update);
  const removeChantier = useMutation(api.chantiers.remove);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (chantier) {
      setFormData({
        name: chantier.name,
        location: chantier.location,
        status: chantier.status,
      });
    }
  }, [chantier]);

  if (chantier === undefined) {
    return <ManageChantierSkeleton />;
  }

  if (chantier === null) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center gap-6">
        <AlertCircle className="w-16 h-16 text-red-600" />
        <h1 className="heading-1 text-ink">Chantier non trouvé</h1>
        <Link href="/chantier" className="button-secondary mt-4">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateChantier({
        id,
        name: formData.name,
        location: formData.location,
        status: formData.status,
      });
      alert("Chantier mis à jour avec succès.");
    } catch (error) {
      console.error("Failed to update chantier:", error);
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce chantier ? Cette action est irréversible.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await removeChantier({ id });
      router.push("/chantier");
    } catch (error) {
      console.error("Failed to delete chantier:", error);
      alert("Erreur lors de la suppression.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center gap-4 border-l-4 border-[var(--color-brand-green)] pl-4">
        <div>
          <h1 className="heading-2 text-ink">Gérer le chantier</h1>
          <p className="body-md text-steel mt-2">Modifiez les informations ou supprimez le chantier du système.</p>
        </div>
      </div>

      <div className="card-base">
        <form onSubmit={handleUpdate} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Nom du chantier</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-input w-full"
              />
            </div>
            
            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Localisation</label>
              <input 
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="text-input w-full"
              />
            </div>

            <div>
              <label className="block text-stone font-medium mb-1.5 text-xs uppercase">Statut</label>
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

      {/* Materials Table */}
      <div className="card-base p-0 overflow-hidden">
        <div className="px-8 py-4 border-b border-[var(--color-hairline)] flex justify-between items-center bg-[var(--color-surface)]">
          <h2 className="text-[14px] font-medium text-stone uppercase tracking-widest">Équipements assignés</h2>
          <span className="badge-green-soft">
            {materials?.length || 0} Matériels
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] text-[16px] text-steel font-medium">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Désignation</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {materials && materials.length > 0 ? (
                materials.map((m) => (
                  <tr key={m._id} className="hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-hairline)]">
                    <td className="px-6 py-4 text-steel font-mono text-[10px] font-medium tracking-widest">{m.code}</td>
                    <td className="px-6 py-4 text-ink font-medium">{m.name}</td>
                    <td className="px-6 py-4 text-steel">{m.category}</td>
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-[14px] uppercase tracking-wider",
                        m.status === "Disponible" ? "bg-[var(--color-brand-green-soft)] text-[var(--color-brand-green-dark)]" : "bg-[var(--color-surface)] text-steel"
                      )}>
                        {m.status}
                      </span>
                    </td>                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-steel text-sm">Aucun matériel assigné à ce chantier.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
