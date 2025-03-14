export type UserRole = "user" | "admin" | "superadmin"

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  username?: string
}

export interface TokenPayload {
  id: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

