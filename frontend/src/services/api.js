const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();

// Generation Service
export const generationService = {
  async generateCode(prompt) {
    return apiService.post('/generate/code', { prompt });
  },

  async generateAPI(prompt) {
    return apiService.post('/generate/api', { prompt });
  },

  async generateUI(prompt) {
    return apiService.post('/generate/ui', { prompt });
  },

  async generateCLI(prompt) {
    return apiService.post('/generate/cli', { prompt });
  }
};

// Creation Service
export const creationService = {
  async getCreations() {
    return apiService.get('/creations');
  },

  async createCreation(creation) {
    return apiService.post('/creations', creation);
  },

  async updateCreation(id, updates) {
    return apiService.put(`/creations/${id}`, updates);
  },

  async deleteCreation(id) {
    return apiService.delete(`/creations/${id}`);
  },

  async executeCreation(id) {
    return apiService.post(`/creations/${id}/execute`);
  },

  async linkCreations(sourceId, targetId, linkType = 'reference') {
    return apiService.post('/creations/link', {
      sourceId,
      targetId,
      linkType
    });
  },

  async unlinkCreations(sourceId, targetId) {
    return apiService.delete(`/creations/link/${sourceId}/${targetId}`);
  },

  async getCreationLinks(id) {
    return apiService.get(`/creations/${id}/links`);
  },

  async getCreationMesh() {
    return apiService.get('/creations/mesh');
  }
};