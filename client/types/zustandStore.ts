export interface userType {
  email: string;
  name: string;
}

export interface userAuthStoreType {
  user: userType | null;
  setUser: (user: userType) => void;
  logout: () => void;
}