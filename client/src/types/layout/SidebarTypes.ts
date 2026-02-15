
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export interface SidebarUrlsTypes {
  key: string;
  name: string;
  path: string;
  icon: ReactNode;
}
export interface SidebarTypes {
  router: AppRouterInstance;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  SidebarUrls: SidebarUrlsTypes[];
  isSidebarOpen: boolean;
}

export interface HeaderTypes {
  activeTab: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}