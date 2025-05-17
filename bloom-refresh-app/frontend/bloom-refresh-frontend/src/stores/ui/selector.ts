import { GetState } from 'zustand';
import { UIState } from '@/types/ui';

export const uiSelectors = (get: GetState<UIState>) => ({
  getTheme: () => get().theme,
  isSidebarOpen: () => get().isSidebarOpen,
  getActiveModal: () => get().activeModal,
  getNotifications: () => get().notifications,
});
