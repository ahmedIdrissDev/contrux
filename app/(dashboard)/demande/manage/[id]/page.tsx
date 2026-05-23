"use client";

import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  MapPin, 
  Package, 
  Tag, 
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  X,
  Save,
  Trash2,
  Plus,
  Check
} from "lucide-react";
import { clsx } from "clsx";
import { DetailsSkeleton } from "@/components/ui/skeleton";

interface Article {
  id?: string;
  code: string;
  designation: string;
  quantity: number;
  unit: string;
}

export default function ManageDemandePage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as Id<"requests">;
  
  const demande = useQuery(api.requests.getById, { id: requestId });
  const chantiers = useQuery(api.chantiers.list);
  const users = useQuery(api.users.list);
  const updateRequest = useMutation(api.requests.update);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    chantier: "",
    demandeur: "",
    dateLivraison: "",
    natureAchat: "",
    typeAchat: "",
    urgency: "Moyenne" as "Faible" | "Moyenne" | "Urgente",
    status: "En attente" as any,
    notes: "",
    articles: [] as Article[]
  });

  const [newArticle, setNewArticle] = useState<Article>({
    code: "",
    designation: "",
    quantity: 0,
    unit: "unité"
  });
  const [showArticleForm, setShowArticleForm] = useState(false);

  useEffect(() => {
    if (demande) {
      setFormData({
        chantier: demande.chantier || "",
        demandeur: demande.demandeur || "",
        dateLivraison: demande.dateLivraison || "",
        natureAchat: demande.natureAchat || "",
        typeAchat: demande.typeAchat || "",
        urgency: (demande.urgency as any) || "Moyenne",
        status: demande.status,
        notes: demande.notes || "",
        articles: (demande.articles || []).map(a => ({ ...a, id: Math.random().toString(36).substr(2, 9) }))
      });
    }
  }, [demande]);

  if (demande === undefined) {
    return <DetailsSkeleton />;
  }

  if (demande === null) {
    return (
      <div className="card-base p-12 text-center flex flex-col items-center gap-6">
        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h1 className="heading-1 text-ink">Demande non trouvée</h1>
        <button 
          onClick={() => router.push("/demande")}
          className="button-secondary"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateRequest({
        id: requestId,
        chantier: formData.chantier,
        demandeur: formData.demandeur,
        dateLivraison: formData.dateLivraison,
        natureAchat: formData.natureAchat,
        typeAchat: formData.typeAchat,
        urgency: formData.urgency,
        status: formData.status,
        notes: formData.notes,
        articles: formData.articles.map(({ id, ...rest }) => rest),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddArticle = () => {
    if (!newArticle.designation || newArticle.quantity <= 0) return;
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { ...newArticle, id: Math.random().toString(36).substr(2, 9) }]
    }));
    setNewArticle({ code: "", designation: "", quantity: 0, unit: "unité" });
    setShowArticleForm(false);
  };

  const handleRemoveArticle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.filter(a => a.id !== id)
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approuvée": return <CheckCircle2 size={16} className="text-brand-green-dark" />;
      case "Refusée": return <XCircle size={16} className="text-red-600" />;
      case "En cours": return <Clock size={16} className="text-brand-green" />;
      default: return <AlertCircle size={16} className="text-amber-600" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Approuvée": return "bg-brand-green-soft text-brand-green-dark border-brand-green/20";
      case "Refusée": return "bg-red-50 text-red-600 border-red-100";
      case "En cours": return "bg-brand-green-soft text-brand-green border-brand-green/10";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between card-base p-8 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push("/demande")}
            className="p-3 hover:bg-[var(--color-surface)] rounded-full transition-colors border border-[var(--color-hairline)] group"
          >
            <ChevronLeft size={20} className="text-stone group-hover:text-ink" />
          </button>
          <div>
            <h1 className="heading-2 tracking-tight text-ink">
              Gestion de la Demande <span className="text-stone font-mono text-sm ml-2">#{demande._id.slice(-6).toUpperCase()}</span>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={clsx(
                "px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-widest",
                getStatusClass(demande.status)
              )}>
                {getStatusIcon(demande.status)}
                {demande.status}
              </span>
              <span className="text-[11px] text-stone font-medium">Créée le {new Date(demande._creationTime).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-full transition-all",
            isEditing 
              ? "button-secondary" 
              : "button-primary"
          )}
        >
          {isEditing ? <X size={16} /> : <Edit2 size={16} />}
          {isEditing ? "Annuler" : "Modifier"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Main Info or Edit Form */}
          <div className="card-base p-0 overflow-hidden">
            <div className="px-8 py-4 border-b border-[var(--color-hairline)] flex justify-between items-center bg-[var(--color-surface)]">
              <h2 className="text-[14px] text-stone uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} className="text-brand-green-dark" />
                Informations Générales
              </h2>
            </div>
            <div className="p-8">
              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-stone font-medium text-xs uppercase">Chantier</label>
                      <select 
                        value={formData.chantier}
                        onChange={(e) => setFormData({...formData, chantier: e.target.value})}
                        className="text-input w-full appearance-none"
                      >
                        <option value="">-- Sélectionner --</option>
                        {chantiers?.map(c => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-stone font-medium text-xs uppercase">Demandeur</label>
                      <select 
                        value={formData.demandeur}
                        onChange={(e) => setFormData({...formData, demandeur: e.target.value})}
                        className="text-input w-full appearance-none"
                      >
                        <option value="">-- Sélectionner --</option>
                        {users?.map(u => (
                          <option key={u._id} value={u.name || u.email}>{u.name || u.email}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-stone font-medium text-xs uppercase">Date de Livraison</label>
                      <input 
                        type="date"
                        value={formData.dateLivraison}
                        onChange={(e) => setFormData({...formData, dateLivraison: e.target.value})}
                        className="text-input w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-stone font-medium text-xs uppercase">Nature d'Achat</label>
                      <select 
                        value={formData.natureAchat}
                        onChange={(e) => setFormData({...formData, natureAchat: e.target.value})}
                        className="text-input w-full appearance-none"
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="matériaux">Matériaux</option>
                        <option value="outillage">Outillage</option>
                        <option value="consommable">Consommable</option>
                        <option value="service">Service</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-stone font-medium text-xs uppercase">Type d'Achat</label>
                      <select 
                        value={formData.typeAchat}
                        onChange={(e) => setFormData({...formData, typeAchat: e.target.value})}
                        className="text-input w-full appearance-none"
                      >
                        <option value="">-- Sélectionner --</option>
                        <option value="local">Local</option>
                        <option value="import">Import</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-stone font-medium text-xs uppercase">Statut</label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className="text-input w-full appearance-none"
                      >
                        <option value="En attente">En attente</option>
                        <option value="Approuvée">Approuvée</option>
                        <option value="Refusée">Refusée</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminée">Terminée</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-[var(--color-hairline)] flex justify-end">
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="button-primary w-full"
                    >
                      <Save size={18} className="inline mr-2" />
                      {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                  <div className="space-y-2">
                    <label className="text-stone font-medium text-xs uppercase">Chantier</label>
                    <div className="flex items-center gap-3 text-ink">
                      <MapPin size={18} className="text-brand-green-dark" />
                      <span className="font-medium text-xl tracking-tight">{demande.chantier || "Non spécifié"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-stone font-medium text-xs uppercase">Demandeur</label>
                    <div className="flex items-center gap-3 text-ink">
                      <User size={18} className="text-brand-green-dark" />
                      <span className="font-medium text-xl tracking-tight">{demande.demandeur || "Non spécifié"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-stone font-medium text-xs uppercase">Date de Livraison</label>
                    <div className="flex items-center gap-3 text-ink">
                      <Calendar size={18} className="text-brand-green-dark" />
                      <span className="font-medium text-xl tracking-tight">{demande.dateLivraison || "Non spécifiée"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-stone font-medium text-xs uppercase">Nature d'Achat</label>
                    <div className="flex items-center gap-3 text-ink">
                      <Tag size={18} className="text-brand-green-dark" />
                      <span className="font-medium text-xl tracking-tight capitalize">{demande.natureAchat || "Non spécifiée"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Articles Table */}
          <div className="card-base p-0 overflow-hidden">
            <div className="px-8 py-4 border-b border-[var(--color-hairline)] flex justify-between items-center bg-[var(--color-surface)]">
              <h2 className="text-[11px] font-bold text-stone uppercase tracking-widest flex items-center gap-2">
                <Package size={16} className="text-brand-green-dark" />
                Articles Demandés
              </h2>
              <div className="flex items-center gap-4">
                {isEditing && (
                  <button 
                    onClick={() => setShowArticleForm(true)}
                    className="button-primary !px-4 !py-1.5 !text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-widest"
                  >
                    <Plus size={14} />
                    Ajouter
                  </button>
                )}
                <span className="badge-green-soft">
                  {formData.articles.length} ITEMS
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] text-[16px] text-steel font-medium">
                  <tr>
                    <th className="px-8 py-4">Code</th>
                    <th className="px-8 py-4">Désignation</th>
                    <th className="px-8 py-4 text-right">Quantité</th>
                    <th className="px-8 py-4">Unité</th>
                    {isEditing && <th className="px-8 py-4 text-center">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-hairline)]">
                  {isEditing && showArticleForm && (
                    <tr className="bg-[var(--color-surface-soft)] border-b border-[var(--color-hairline)]">
                      <td className="px-8 py-4">
                        <input 
                          type="text" 
                          value={newArticle.code}
                          onChange={(e) => setNewArticle({...newArticle, code: e.target.value})}
                          placeholder="Code..."
                          className="text-input w-full h-10 px-3"
                        />
                      </td>
                      <td className="px-8 py-4">
                        <input 
                          type="text" 
                          value={newArticle.designation}
                          onChange={(e) => setNewArticle({...newArticle, designation: e.target.value})}
                          placeholder="Désignation..."
                          className="text-input w-full h-10 px-3"
                        />
                      </td>
                      <td className="px-8 py-4">
                        <input 
                          type="number" 
                          value={newArticle.quantity || ""}
                          onChange={(e) => setNewArticle({...newArticle, quantity: Number(e.target.value)})}
                          placeholder="0.00"
                          className="text-input w-full h-10 px-3"
                        />
                      </td>
                      <td className="px-8 py-4">
                        <select 
                          value={newArticle.unit}
                          onChange={(e) => setNewArticle({...newArticle, unit: e.target.value})}
                          className="text-input w-full h-10 px-3 appearance-none"
                        >
                          <option value="unité">Unité</option>
                          <option value="kg">Kg</option>
                          <option value="m">Mètre</option>
                          <option value="m2">M2</option>
                          <option value="m3">M3</option>
                          <option value="lot">Lot</option>
                        </select>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={handleAddArticle} className="p-2 text-brand-green-dark hover:bg-brand-green/10 rounded-full transition-colors"><Check size={18} /></button>
                          <button onClick={() => setShowArticleForm(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><X size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {formData.articles.length > 0 ? (
                    formData.articles.map((article) => (
                      <tr key={article.id} className="text-sm hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-hairline)]">
                        <td className="px-8 py-4 text-steel font-mono text-[10px] font-bold uppercase tracking-widest">{article.code || "-"}</td>
                        <td className="px-8 py-4 text-ink font-medium">{article.designation}</td>
                        <td className="px-8 py-4 text-right font-bold text-ink">{article.quantity}</td>
                        <td className="px-8 py-4 text-steel uppercase text-[10px] font-bold tracking-widest">{article.unit}</td>
                        {isEditing && (
                          <td className="px-8 py-4">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => handleRemoveArticle(article.id!)}
                                className="p-2 text-slate hover:text-red-500 hover:bg-red-50 rounded-full transition-colors border border-[var(--color-hairline)]"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isEditing ? 5 : 4} className="px-8 py-16 text-center text-steel italic">Aucun article dans cette demande.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Side Panels */}
        <div className="space-y-8">
          {/* Notes/Comments */}
          <div className="card-base p-0 overflow-hidden">
            <div className="px-8 py-4 border-b border-[var(--color-hairline)] flex justify-between items-center bg-[var(--color-surface)]">
              <h2 className="text-[14px] text-stone uppercase tracking-widest flex items-center gap-2">
                Commentaires
              </h2>
            </div>
            <div className="p-8">
              {isEditing ? (
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="text-input w-full min-h-[180px] py-4 resize-none"
                  placeholder="Ajouter un commentaire..."
                />
              ) : (
                <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-hairline)] text-sm text-steel min-h-[120px] leading-relaxed italic">
                  {demande.notes || "Aucun commentaire pour cette demande."}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats/Info */}
          <div className="bg-[var(--color-canvas-dark)] text-white rounded-[var(--radius-lg)] p-8 relative overflow-hidden shadow-xl border border-[var(--color-hairline-dark)]">
            <div className="relative z-10">
              <h3 className="text-[14px] uppercase tracking-[0.2em] text-[var(--color-on-dark-muted)] mb-6">Urgence & Priorité</h3>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-3">
                    {["Faible", "Moyenne", "Urgente"].map((u) => (
                      <button
                        key={u}
                        onClick={() => setFormData({...formData, urgency: u as any})}
                        className={clsx(
                          "w-full py-3 rounded-full text-[14px] uppercase tracking-widest border transition-all",
                          formData.urgency === u 
                            ? "bg-[var(--color-brand-green)] text-[var(--color-on-primary)] border-[var(--color-brand-green)] shadow-lg" 
                            : "bg-white/5 text-[var(--color-on-dark-muted)] border-white/10 hover:bg-white/10"
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                  <div className="text-[14px] text-[var(--color-on-dark-muted)] font-medium italic">Sélectionnez le niveau d'urgence.</div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className={clsx(
                    "p-4 rounded-[var(--radius-lg)] border",
                    demande.urgency === "Urgente" ? "bg-red-500/20 border-red-500/50" : "bg-white/5 border-white/10"
                  )}>
                    <AlertCircle size={28} className={demande.urgency === "Urgente" ? "text-red-500" : "text-[var(--color-brand-green)]"} />
                  </div>
                  <div>
                    <div className="text-2xl font-medium tracking-tight">{demande.urgency || "Normale"}</div>
                    <div className="text-[14px] text-[var(--color-on-dark-muted)] uppercase tracking-widest mt-1">Priorité de traitement</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
