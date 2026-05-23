'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
  const client = await clerkClient()

  if (!(await checkRole('system:admin:all'))) {
    return { error: 'Non autorisé' }
  }

  try {
    const emailAddress = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const role = formData.get('role') as string || 'system:manager:all'

    await client.users.createUser({
      emailAddress: [emailAddress],
      password,
      firstName,
      lastName,
      publicMetadata: { role },
    })
    
    revalidatePath('/administration/users')
    return { success: true }
  } catch (err) {
    return { error: (err as any).errors?.[0]?.message || (err as Error).message }
  }
}

export async function updateUser(formData: FormData) {
  const client = await clerkClient()

  if (!(await checkRole('system:admin:all'))) {
    return { error: 'Non autorisé' }
  }

  try {
    const id = formData.get('id') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const role = formData.get('role') as string
    
    await client.users.updateUser(id, {
      firstName,
      lastName,
      publicMetadata: { role },
    })

    revalidatePath('/administration/users')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export async function setRole(formData: FormData) {
  const client = await clerkClient()

  if (!(await checkRole('system:admin:all'))) {
    return { error: 'Non autorisé' }
  }

  try {
    const id = formData.get('id') as string
    const role = formData.get('role') as string
    
    await client.users.updateUserMetadata(id, {
      publicMetadata: { role },
    })
    revalidatePath('/administration/users')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient()

  if (!(await checkRole('system:admin:all'))) {
    return { error: 'Non autorisé' }
  }

  try {
    const id = formData.get('id') as string
    
    await client.users.updateUserMetadata(id, {
      publicMetadata: { role: null },
    })
    revalidatePath('/administration/users')
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}
