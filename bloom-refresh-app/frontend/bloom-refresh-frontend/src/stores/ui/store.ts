import { create } from 'zustand';
import { UIState } from '@/types/ui';
import { uiActions } from './actions';
import { uiSelectors } from './selectors';

export const useUIStore = create<UIState>()((set, get) => ({
  theme: 'light',
  isSidebarOpen: false,
  activeModal: null,
  notifications: [],
  
  // Actions
  ...uiActions(set, get),
  
  // Selectors
  ...uiSelectors(get),
}));
