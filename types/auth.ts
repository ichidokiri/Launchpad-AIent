export type UserRole = "USER" | "ADMIN"
export type UserStatus = "active" | "inactive" | "suspended"

export interface UserData {
  id: string
  email: string
  status: UserStatus
  role: UserRole
  monadBalance?: number
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: UserData | null
  isLoading: boolean
  error: string | null
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: TokenPayload
}

export interface TokenPayload {
  id: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export interface RefreshTokenResponse {
  success: boolean
  message?: string
  userData?: Omit<UserData, "password">
  newToken?: string
}

