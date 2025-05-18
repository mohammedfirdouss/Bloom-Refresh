import { UIState } from '@/types/ui';

export const uiSelectors = (get: () => UIState) => ({
  getTheme: () => get().theme,
  getIsSidebarOpen: () => get().isSidebarOpen,
  getActiveModal: () => get().activeModal,
  getNotifications: () => get().notifications,
});
