import { UIState } from '@/types/ui';

export const uiActions = (
  set: (partial: Partial<UIState> | ((state: UIState) => Partial<UIState>), replace?: boolean) => void,
  get: () => UIState
) => ({
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (modalId: string) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  addNotification: (notification: { id: string; message: string; type: 'success' | 'error' | 'info' }) => 
    set(state => ({ notifications: [...state.notifications, notification] })),
  removeNotification: (id: string) => 
    set(state => ({ notifications: state.notifications.filter(n => n.id !== id) })),
});
