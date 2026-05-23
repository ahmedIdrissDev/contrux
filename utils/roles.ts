import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles | Roles[]) => {
  try {
    const { sessionClaims } = await auth()
    const userRole = sessionClaims?.metadata?.role

    if (Array.isArray(role)) {
      return userRole !== undefined && role.includes(userRole)
    }

    return userRole === role
  } catch (error) {
    console.error('Error in checkRole:', error)
    return false
  }
}
