import { apiService } from './api';

class AuthService {
  async login(email, password) {
    const response = await apiService.post('/auth/login', { email, password });
    return response;
  }

  async register(email, password, name) {
    const response = await apiService.post('/auth/register', { email, password, name });
    return response;
  }

  async verifyToken(token) {
    return apiService.get('/auth/profile');
  }

  async refreshToken() {
    return apiService.post('/auth/refresh');
  }

  async updateProfile(updates) {
    return apiService.put('/auth/profile', updates);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();