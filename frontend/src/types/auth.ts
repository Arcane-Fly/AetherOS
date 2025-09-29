// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

// Auth Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

// Auth Response Types
export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export interface TokenVerificationResponse {
  success: boolean;
  user: User;
  valid: boolean;
}