export interface JWTPayload {
    userId: number;
    roles: number[];
    username: string,
}

export interface UserSession {
    userId: number
}
