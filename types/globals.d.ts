// types/globals.d.ts
export {}

export type Roles = 'system:manager:all' | 'system:admin:all' | 'system:gestion:create'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}