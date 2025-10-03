import type {
  ApiResponse,
  CodeGenerationResponse,
  APIGenerationResponse,
  UIGenerationResponse,
  CLIGenerationResponse,
  Creation,
  CreationFilters,
  VersionHistoryResponse,
  TemplateResponse,
  CreateFromTemplateRequest,
  ImportExportOptions,
  RequestConfig,
} from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  async request<T = any>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token && config.headers) {
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

  get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();

// Generation Service
export const generationService = {
  async generateCode(prompt: string): Promise<CodeGenerationResponse> {
    return apiService.post<CodeGenerationResponse>('/generate/code', { prompt });
  },

  async generateAPI(prompt: string): Promise<APIGenerationResponse> {
    return apiService.post<APIGenerationResponse>('/generate/api', { prompt });
  },

  async generateUI(prompt: string): Promise<UIGenerationResponse> {
    return apiService.post<UIGenerationResponse>('/generate/ui', { prompt });
  },

  async generateCLI(prompt: string): Promise<CLIGenerationResponse> {
    return apiService.post<CLIGenerationResponse>('/generate/cli', { prompt });
  },
};

// Creation Service
export const creationService = {
  async getCreations(filters: CreationFilters = {}): Promise<Creation[]> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });

    const endpoint = queryParams.toString() ? `/creations?${queryParams}` : '/creations';
    return apiService.get<Creation[]>(endpoint);
  },

  async searchCreations(filters: CreationFilters = {}): Promise<Creation[]> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') queryParams.append(key, String(value));
    });

    const endpoint = queryParams.toString()
      ? `/creations/search?${queryParams}`
      : '/creations/search';
    return apiService.get<Creation[]>(endpoint);
  },

  async createCreation(creation: Partial<Creation>): Promise<Creation> {
    return apiService.post<Creation>('/creations', creation);
  },

  async updateCreation(id: number, updates: Partial<Creation>): Promise<Creation> {
    return apiService.put<Creation>(`/creations/${id}`, updates);
  },

  async updateCreationWithVersion(
    id: number,
    updates: Partial<Creation>,
    createNewVersion = true
  ): Promise<Creation> {
    return apiService.put<Creation>(`/creations/${id}`, { ...updates, createNewVersion });
  },

  async getVersionHistory(id: number): Promise<VersionHistoryResponse> {
    return apiService.get<VersionHistoryResponse>(`/creations/${id}/versions`);
  },

  async restoreVersion(baseId: number, versionId: number): Promise<ApiResponse> {
    return apiService.post<ApiResponse>(`/creations/${baseId}/restore-version/${versionId}`);
  },

  async deleteCreation(id: number): Promise<ApiResponse> {
    return apiService.delete<ApiResponse>(`/creations/${id}`);
  },

  async executeCreation(id: number): Promise<ApiResponse> {
    return apiService.post<ApiResponse>(`/creations/${id}/execute`);
  },

  async linkCreations(
    sourceId: number,
    targetId: number,
    linkType: 'reference' | 'extends' | 'imports' | 'dependency' = 'reference'
  ): Promise<ApiResponse> {
    return apiService.post<ApiResponse>('/creations/link', {
      sourceId,
      targetId,
      linkType,
    });
  },

  async unlinkCreations(sourceId: number, targetId: number): Promise<ApiResponse> {
    return apiService.delete<ApiResponse>(`/creations/link/${sourceId}/${targetId}`);
  },

  async getCreationLinks(id: number): Promise<any> {
    return apiService.get(`/creations/${id}/links`);
  },

  async getCreationMesh(): Promise<any> {
    return apiService.get('/creations/mesh');
  },

  async exportCreation(id: number): Promise<Blob> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/creations/${id}/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  async exportMultipleCreations(
    creationIds: number[] | null = null,
    includeLinks = true
  ): Promise<Blob> {
    const body: any = { includeLinks };
    if (creationIds) {
      body.creationIds = creationIds;
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/creations/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  async importCreations(importData: any, options: ImportExportOptions = {}): Promise<ApiResponse> {
    const { overwriteExisting = false, preserveLinks = true } = options;
    return apiService.post<ApiResponse>('/creations/import', {
      importData,
      overwriteExisting,
      preserveLinks,
    });
  },

  // Template methods
  async getTemplates(filters: CreationFilters = {}): Promise<TemplateResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') queryParams.append(key, String(value));
    });

    const endpoint = queryParams.toString()
      ? `/creations/templates?${queryParams}`
      : '/creations/templates';
    return apiService.get<TemplateResponse>(endpoint);
  },

  async createFromTemplate(
    templateId: number,
    options: CreateFromTemplateRequest = {}
  ): Promise<ApiResponse<Creation>> {
    return apiService.post<ApiResponse<Creation>>(
      `/creations/templates/${templateId}/create`,
      options
    );
  },

  async makeTemplate(
    creationId: number,
    templateCategory = 'User Templates'
  ): Promise<ApiResponse> {
    return apiService.post<ApiResponse>(`/creations/${creationId}/make-template`, {
      templateCategory,
    });
  },

  async removeTemplate(creationId: number): Promise<ApiResponse> {
    return apiService.post<ApiResponse>(`/creations/${creationId}/remove-template`);
  },
};
