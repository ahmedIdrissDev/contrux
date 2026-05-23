"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { 
  Trash2,
  X,
  Plus, 
  Eraser, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Loader2
} from "lucide-react";
import { clsx } from "clsx";
import { useEffect } from "react";

const STEPS = [
  "Informations Générales",
  "Détails de l'Achat",
  "Articles & Documents",
  "Validation"
];

interface Article {
  id: string;
  code: string;
  designation: string;
  quantity: number;
  unit: string;
}

export default function CreateDemandePage() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const createRequest = useMutation(api.requests.create);
  const chantiers = useQuery(api.chantiers.list);
  const users = useQuery(api.users.list);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    chantier: "",
    gestionnaire: "",
    dateLivraison: "",
    demandeur: "",
    natureAchat: "",
    typeAchat: "",
    commentaire: "",
    avance: false,
    articles: [] as Article[]
  });

  useEffect(() => {
    if (isUserLoaded && user) {
      const email = user.primaryEmailAddress?.emailAddress || "";
      setFormData(prev => ({ ...prev, gestionnaire: email }));
    }
  }, [isUserLoaded, user]);

  const [newArticle, setNewArticle] = useState<Omit<Article, 'id'>>({
    code: "",
    designation: "",
    quantity: 0,
    unit: "unité"
  });
  const [showArticleForm, setShowArticleForm] = useState(false);

  const handleAddArticle = () => {
    if (!newArticle.designation || newArticle.quantity <= 0) return;
    
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { ...newArticle, id: Math.random().toString(36).substr(2, 9) }]
    }));
    setNewArticle({
      code: "",
      designation: "",
      quantity: 0,
      unit: "unité"
    });
    setShowArticleForm(false);
  };

  const handleRemoveArticle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles.filter(a => a.id !== id)
    }));
  };

  const handleClearArticles = () => {
    setFormData(prev => ({ ...prev, articles: [] }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createRequest({
        type: "approvisionnement",
        chantier: formData.chantier,
        demandeur: formData.demandeur,
        dateLivraison: formData.dateLivraison,
        natureAchat: formData.natureAchat,
        typeAchat: formData.typeAchat,
        articles: formData.articles.map(({ id, ...rest }) => rest),
        notes: formData.commentaire,
      });
      router.push("/demande");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Une erreur est survenue lors de l'envoi de la demande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  return (
    <div className="flex flex-col gap-8 text-sm max-w-5xl mx-auto">
      {/* Main Header */}
      <div className="flex flex-col gap-2 border-l-4 border-[var(--color-brand-green)] pl-4">
        <h1 className="heading-2 text-ink">Nouvelle demande d&apos;approvisionnement</h1>
        <p className="body-md text-steel">Créez une nouvelle demande de ressources pour vos chantiers.</p>
      </div>

      {/* Stepper */}
   
      <div className="card-base bg-[var(--color-canvas)] min-h-[450px] flex flex-col overflow-hidden">
        {/* Step Content */}
        <div className="p-8 flex-1">
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-ink border-b border-[var(--color-hairline)] pb-4 flex items-center gap-3 heading-5">
                <span className="text-white font-medium text-[14px] bg-ink px-2 py-1 rounded-full border border-hairline">01</span>
                Informations du Projet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-stone font-medium text-xs mb-1.5 uppercase">Chantier : (*)</label>
                  <select 
                    name="chantier"
                    value={formData.chantier}
                    onChange={handleChange}
                    className="text-input w-full appearance-none"
                    disabled={!chantiers}
                  >
                    <option value="">{chantiers ? "-- Sélectionner --" : "Chargement..."}</option>
                    {chantiers?.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-stone font-medium text-xs mb-1.5 uppercase">Gestionnaire : (*)</label>
                  <input 
                    type="text"
                    name="gestionnaire"
                    value={formData.gestionnaire}
                    onChange={handleChange}
                    className="text-input w-full bg-surface"
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-stone font-medium text-xs mb-1.5 uppercase">Demandeur : (*)</label>
                  <select 
                    name="demandeur"
                    value={formData.demandeur}
                    onChange={handleChange}
                    className="text-input w-full appearance-none"
                    disabled={!users}
                  >
                    <option value="">{users ? "-- Sélectionner --" : "Chargement..."}</option>
                    {users?.map((u: any) => (
                      <option key={u._id} value={u.name || u.email}>{u.name || u.email}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-stone font-medium text-xs mb-1.5 uppercase">Date souhaitée : (*)</label>
                  <input 
                    type="date"
                    name="dateLivraison"
                    value={formData.dateLivraison}
                    onChange={handleChange}
                    className="text-input w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-ink border-b border-[var(--color-hairline)] pb-4 flex items-center gap-3 heading-5">
                <span className="text-white font-medium text-[14px] bg-ink px-2 py-1 rounded-full border border-hairline">01</span>
                Informations du Projet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-stone font-medium text-xs mb-1.5 uppercase">Nature d&apos;Achat :</label>
                  <select 
                    name="natureAchat"
                    value={formData.natureAchat}
                    onChange={handleChange}
                    className="text-input w-full appearance-none"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="materiel">Matériel</option>
                    <option value="consommable">Consommable</option>
                    <option value="service">Service</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-stone font-medium text-xs mb-1.5 uppercase">Type d&apos;Achat :</label>
                  <select 
                    name="typeAchat"
                    value={formData.typeAchat}
                    onChange={handleChange}
                    className="text-input w-full appearance-none"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="local">Local</option>
                    <option value="import">Import</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-stone font-medium text-xs mb-1.5 uppercase">Commentaire:</label>
                  <textarea 
                    name="commentaire"
                    value={formData.commentaire}
                    onChange={handleChange}
                    rows={4}
                    className="text-input w-full resize-none min-h-[120px] py-3"
                    placeholder="Informations complémentaires..."
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Articles Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-[var(--color-hairline)] pb-4">
                  <h2 className="text-ink flex items-center gap-3 heading-5">
                    <span className="text-white font-bold text-xs bg-ink px-2 py-1 rounded-full border border-hairline">03</span>
                    Liste des Articles
                  </h2>
                  <div className="flex gap-3">
                    {!showArticleForm && (
                      <button 
                        type="button"
                        onClick={() => setShowArticleForm(true)}
                        className="button-primary flex items-center gap-2 !px-5 !py-2 !text-[11px] font-bold uppercase"
                      >
                        <Plus size={14} />
                        <span>Ajouter</span>
                      </button>
                    )}
                    <button 
                      type="button"
                      onClick={handleClearArticles}
                      className="button-secondary flex items-center gap-2 !px-5 !py-2 !text-[11px] font-bold uppercase"
                    >
                      <Eraser size={14} />
                      <span>Vider</span>
                    </button>
                  </div>
                </div>

                <div className="border border-[var(--color-hairline)] overflow-hidden rounded-[var(--radius-lg)]">
                  <table className="w-full text-left">
                    <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] text-[16px] text-steel font-medium">
                      <tr>
                        <th className="px-6 py-4">Code</th>
                        <th className="px-6 py-4">Désignation</th>
                        <th className="px-6 py-4">Quantité</th>
                        <th className="px-6 py-4">Unité</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[var(--color-canvas)] text-sm">
                      {showArticleForm && (
                        <tr className="bg-[var(--color-surface-soft)] border-b border-[var(--color-hairline)]">
                          <td className="px-6 py-4">
                            <input 
                              type="text" 
                              value={newArticle.code}
                              onChange={(e) => setNewArticle({...newArticle, code: e.target.value})}
                              placeholder="Code..."
                              className="text-input w-full h-10 px-3"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="text" 
                              value={newArticle.designation}
                              onChange={(e) => setNewArticle({...newArticle, designation: e.target.value})}
                              placeholder="Désignation..."
                              className="text-input w-full h-10 px-3"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="number" 
                              value={newArticle.quantity || ""}
                              onChange={(e) => setNewArticle({...newArticle, quantity: Number(e.target.value)})}
                              placeholder="0.00"
                              className="text-input w-full h-10 px-3"
                            />
                          </td>
                          <td className="px-6 py-4">
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
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={handleAddArticle}
                                className="p-2 text-brand-green-dark hover:bg-brand-green/10 rounded-full transition-colors"
                                title="Valider"
                              >
                                <Check size={18} />
                              </button>
                              <button 
                                onClick={() => setShowArticleForm(false)}
                                className="p-2 text-slate hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Annuler"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      {formData.articles.length === 0 && !showArticleForm ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-steel">Aucun article sélectionné.</td>
                        </tr>
                      ) : (
                        formData.articles.map((article) => (
                          <tr key={article.id} className="hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-hairline)]">
                            <td className="px-6 py-4 text-steel font-mono text-[14px] uppercase tracking-widest">{article.code || "-"}</td>
                            <td className="px-6 py-4 text-ink font-medium">{article.designation}</td>
                            <td className="px-6 py-4 text-ink font-medium">{article.quantity}</td>
                            <td className="px-6 py-4 text-steel uppercase text-[14px] tracking-widest">{article.unit}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center">
                                <button 
                                  onClick={() => handleRemoveArticle(article.id)}
                                  className="p-2 text-slate hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-ink border-b border-[var(--color-hairline)] pb-4 flex items-center gap-3 heading-5">
                <span className="text-white font-bold text-xs bg-ink px-2 py-1 rounded-full border border-hairline">04</span>
                Vérification Finale
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[var(--color-surface)] p-6 border border-[var(--color-hairline)] rounded-[var(--radius-lg)]">
                  <h3 className="text-stone uppercase mb-4 text-[11px] font-bold tracking-widest">Projet</h3>
                  <div className="space-y-3">
                    <p className="flex justify-between text-steel text-sm"><span>Chantier:</span> <span className="text-ink font-semibold">{formData.chantier || "-"}</span></p>
                    <p className="flex justify-between text-steel text-sm"><span>Demandeur:</span> <span className="text-ink font-semibold">{formData.demandeur || "-"}</span></p>
                    <p className="flex justify-between text-steel text-sm"><span>Livraison:</span> <span className="text-ink font-semibold">{formData.dateLivraison || "-"}</span></p>
                  </div>
                </div>
                <div className="bg-[var(--color-surface)] p-6 border border-[var(--color-hairline)] rounded-[var(--radius-lg)]">
                  <h3 className="text-stone uppercase mb-4 text-[11px] font-bold tracking-widest">Achat</h3>
                  <div className="space-y-3">
                    <p className="flex justify-between text-steel text-sm"><span>Nature:</span> <span className="text-ink font-semibold capitalize">{formData.natureAchat || "-"}</span></p>
                    <p className="flex justify-between text-steel text-sm"><span>Type:</span> <span className="text-ink font-semibold capitalize">{formData.typeAchat || "-"}</span></p>
                    <p className="flex justify-between text-steel text-sm items-center"><span>Avance:</span> <span className="badge-green-soft">{formData.avance ? "OUI" : "NON"}</span></p>
                  </div>
                </div>
              </div>

              {/* Articles Summary */}
              <div className="space-y-4">
                <h3 className="text-stone uppercase text-[11px] font-bold tracking-widest">Articles ({formData.articles.length})</h3>
                <div className="border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden bg-canvas">
                  <table className="w-full text-left">
                    <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] uppercase text-[10px] tracking-widest text-steel font-bold">
                      <tr>
                        <th className="px-6 py-4">Code</th>
                        <th className="px-6 py-4">Désignation</th>
                        <th className="px-6 py-4 text-right">Qté</th>
                        <th className="px-6 py-4">Unité</th>
                      </tr>
                    </thead>
                    <tbody className="bg-canvas">
                      {formData.articles.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-steel">Aucun article sélectionné.</td>
                        </tr>
                      ) : (
                        formData.articles.map((article) => (
                          <tr key={article.id} className="text-sm hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-hairline)]">
                            <td className="px-6 py-4 text-steel font-mono text-[10px] font-bold uppercase tracking-widest">{article.code || "-"}</td>
                            <td className="px-6 py-4 text-ink font-medium">{article.designation}</td>
                            <td className="px-6 py-4 text-right font-bold">{article.quantity}</td>
                            <td className="px-6 py-4 uppercase text-steel text-[14px] tracking-widest">{article.unit}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>



              {/* Action DA Section */}
              <div className="pt-8 border-t border-[var(--color-hairline)]">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button 
                    onClick={handleSubmit}
                    type="button"
                    disabled={isSubmitting}
                    className="button-primary flex items-center justify-center gap-3 w-full sm:w-auto min-w-[240px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Envoyer la Demande</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="p-6 bg-[var(--color-surface)] border-t border-[var(--color-hairline)] flex justify-between items-center">
          <button
            type="button"
            onClick={currentStep === 1 ? () => router.push("/demande") : prevStep}
            className="button-secondary flex items-center gap-2 !px-6 !py-2 uppercase !text-[14px]"
          >
            <ChevronLeft size={16} />
            <span>{currentStep === 1 ? "Annuler" : "Précédent"}</span>
          </button>
          
          {currentStep < STEPS.length && (
            <button
              type="button"
              onClick={nextStep}
              className="button-primary flex items-center gap-2 !px-12 !py-2.5 uppercase !text-[14px]"
            >
              <span>Suivant</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
