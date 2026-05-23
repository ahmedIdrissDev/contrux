'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createUser } from './_actions'

export const CreateUserModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createUser(formData)

    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      setIsOpen(false)
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="button-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Nouvel utilisateur
      </button>

      {isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="heading-3 mb-8 text-ink">Nouvel utilisateur</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-stone font-medium mb-1.5 text-xs">Prénom</label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    className="text-input w-full"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-stone font-medium mb-1.5 text-xs">Nom</label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="text-input w-full"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="text-input w-full"
                  placeholder="jean.dupont@exemple.com"
                />
              </div>

              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Mot de passe</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="text-input w-full"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-stone font-medium mb-1.5 text-xs">Rôle</label>
                <select
                  name="role"
                  className="text-input w-full appearance-none"
                >
                  <option value="system:manager:all">Manager (Tout)</option>
                  <option value="system:admin:all">Admin (Tout)</option>
                  <option value="system:gestion:create">Gestion (Création)</option>
                </select>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-md flex items-start gap-2 text-red-600">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary mt-4 w-full"
              >
                {isSubmitting ? "Création..." : "Créer l'utilisateur"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
