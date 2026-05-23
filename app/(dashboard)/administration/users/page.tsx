import { redirect } from 'next/navigation'
import { checkRole } from '@/utils/roles'
import { SearchUsers } from './SearchUsers'
import { clerkClient } from '@clerk/nextjs/server'
import { removeRole } from './_actions'
import { User, Shield, ShieldAlert, ShieldCheck, X, Edit2 } from 'lucide-react'
import { CreateUserModal } from './CreateUserModal'
import { EditUserModal } from './EditUserModal'
import { clsx } from 'clsx'

export default async function UsersAdminPage(props: {
  searchParams: Promise<{ search?: string }>
}) {
  
  
  const searchParams = await props.searchParams
  const query = searchParams.search
  
  let users: any[] = []
  let errorMessage: string | null = null
  
  try {
    const client = await clerkClient()
    if (!client) {
      throw new Error('Clerk client could not be initialized.')
    }

    const response = query 
      ? await client.users.getUserList({ query }) 
      : await client.users.getUserList()
    
    if (Array.isArray(response)) {
      users = response
    } else if (response && 'data' in response) {
      users = response.data
    } else {
      console.warn('Unexpected response structure from Clerk:', response)
      users = []
    }
  } catch (error: any) {
    console.error('Error in UsersAdminPage:', error)
    errorMessage = error.message || 'Erreur lors de la récupération des utilisateurs.'
    if (error.status === 401) {
      errorMessage = 'Non autorisé (401) : Votre CLERK_SECRET_KEY est invalide ou absente.'
    } else if (error.status === 403) {
      errorMessage = 'Interdit (403) : Votre clé API n\'a pas les permissions nécessaires.'
    } else if (error.errors) {
      errorMessage = error.errors[0]?.message || errorMessage
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center border-l-4 border-[var(--color-brand-green)] pl-4">
        <div>
          <h1 className="heading-2 text-ink">Gestion des Utilisateurs</h1>
          <p className="body-md text-steel mt-2">Gérez les rôles et les accès des utilisateurs.</p>
        </div>
        <CreateUserModal />
      </div>

      <SearchUsers />

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-[var(--radius-md)] text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="card-base p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--color-surface)] border-b border-[var(--color-hairline)] text-[16px]">
            <tr>
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-hairline)]">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="text-sm hover:bg-[var(--color-surface)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[var(--color-surface-soft)] flex items-center justify-center mr-4 border border-[var(--color-hairline)] overflow-hidden">
                        {user.imageUrl ? (
                          <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-steel" />
                        )}
                      </div>
                      <div className="text-sm font-medium text-ink">
                        {user.firstName} {user.lastName}
                        {!user.firstName && !user.lastName && user.username}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-steel">
                    {user.emailAddresses.find((email: any) => email.id === user.primaryEmailAddressId)?.emailAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span >
                      {user.publicMetadata.role === 'system:admin:all' ? 'Admin' :
                       user.publicMetadata.role === 'system:manager:all' ? 'Manager' :
                       user.publicMetadata.role === 'system:gestion:create' ? 'Gestion' :
                       'Aucun'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <EditUserModal user={{
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        publicMetadata: user.publicMetadata
                      }} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-steel text-sm">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
