export interface JWTPayload {
  userId: number;
  roles: number[];
  username: string;
  isAdmin: boolean;
}

export interface UserSession {
  userId: number;
  isAdmin: boolean;
}
