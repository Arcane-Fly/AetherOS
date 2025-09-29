import { apiService } from './api';
import type { 
  AuthResponse, 
  ProfileResponse, 
  TokenVerificationResponse,
  ProfileUpdateRequest 
} from '../types/auth';

class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', { email, password });
    return response;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', { email, password, name });
    return response;
  }

  async verifyToken(token: string): Promise<TokenVerificationResponse> {
    return apiService.get<TokenVerificationResponse>('/auth/profile');
  }

  async refreshToken(): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/refresh');
  }

  async updateProfile(updates: ProfileUpdateRequest): Promise<ProfileResponse> {
    return apiService.put<ProfileResponse>('/auth/profile', updates);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();