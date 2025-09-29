import type { Creation } from './api';
import type { User } from './auth';

// Component Props Types
export interface ChatInterfaceProps {
  user: User;
  creations: Creation[];
  setCreations: React.Dispatch<React.SetStateAction<Creation[]>>;
}

export interface CreationHistoryProps {
  creations: Creation[];
  setCreations: React.Dispatch<React.SetStateAction<Creation[]>>;
}

export interface CreationLinkerProps {
  creations: Creation[];
  onLink?: (linkData: {
    sourceId: number;
    targetIds: number[];
    linkType: string;
  }) => void;
  currentCreationId?: number | null;
}

export interface TemplateBrowserProps {
  onTemplateSelect: (creation: Creation, template: any) => void;
  onClose: () => void;
}

export interface AuthFormProps {
  onLogin: (userData: { user: User; token: string }) => void;
}

export interface OAuthCallbackProps {
  onLogin: (userData: { user: User; token: string }) => void;
}

// Message Types
export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
  generationType?: 'code' | 'api' | 'ui' | 'cli';
  content?: string;
  language?: string;
  metadata?: Record<string, any>;
  framework?: string;
  executable?: boolean;
}

// State Types
export interface AppState {
  user: User | null;
  loading: boolean;
  creations: Creation[];
}

// Event Handler Types
export type LoginHandler = (userData: { user: User; token: string }) => void;
export type LogoutHandler = () => void;
export type CreationsUpdater = React.Dispatch<React.SetStateAction<Creation[]>>;