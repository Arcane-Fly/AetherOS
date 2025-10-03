// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Generation Types
export interface GenerationRequest {
  prompt: string;
}

export interface CodeGenerationResponse {
  success: boolean;
  code: string;
  language: string;
  error?: string;
}

export interface APIGenerationResponse {
  success: boolean;
  specification: string;
  language: string;
  metadata?: Record<string, any>;
  error?: string;
}

export interface UIGenerationResponse {
  success: boolean;
  component: string;
  language: string;
  framework: string;
  error?: string;
}

export interface CLIGenerationResponse {
  success: boolean;
  code: string;
  language: string;
  executable: boolean;
  error?: string;
}

// Creation Types
export interface Creation {
  id: number;
  name: string;
  description: string;
  type: 'code' | 'api' | 'ui' | 'cli';
  content: string;
  language: string;
  metadata?: Record<string, any>;
  framework?: string;
  executable?: boolean;
  timestamp: Date;
  created_at?: Date;
  updated_at?: Date;
  version?: number;
  version_count?: number;
  is_template?: boolean;
  links?: CreationLink[];
}

export interface CreationLink {
  targetId: number;
  type: 'reference' | 'extends' | 'imports' | 'dependency';
  timestamp: Date;
}

export interface CreationFilters {
  type?: string;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface CreationVersion {
  id: number;
  version: number;
  description: string;
  created_at: Date;
  is_current_version: boolean;
}

export interface VersionHistoryResponse {
  baseCreationId: number;
  versions: CreationVersion[];
}

// Template Types
export interface Template extends Creation {
  category: string;
  metadata: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimated_time?: string;
    [key: string]: any;
  };
}

export interface TemplateResponse {
  categories: Record<string, Template[]>;
}

export interface CreateFromTemplateRequest {
  name?: string;
  [key: string]: any;
}

export interface ImportExportOptions {
  overwriteExisting?: boolean;
  preserveLinks?: boolean;
  includeLinks?: boolean;
  creationIds?: number[];
}

export interface ImportResponse {
  success: boolean;
  summary: {
    imported: number;
    skipped: number;
    errors: number;
  };
  message?: string;
  error?: string;
}

// Link Types
export interface LinkCreationsRequest {
  sourceId: number;
  targetId: number;
  linkType: 'reference' | 'extends' | 'imports' | 'dependency';
}

// Request Config Types
export interface RequestConfig extends RequestInit {
  headers?: Record<string, string>;
}
