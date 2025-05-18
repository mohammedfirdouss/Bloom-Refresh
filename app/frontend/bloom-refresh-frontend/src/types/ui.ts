// src/types/ui.ts
export interface UIState {
    theme: 'light' | 'dark';
    isSidebarOpen: boolean;
    activeModal: string | null;
    notifications: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  }