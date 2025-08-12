export interface BaseResponse {
     success: boolean;
     message: string;
}

export interface LoginRequest {
     email: string;
     password: string;
     role: Role;
     userAgent: string;
}

export enum Role {
     ADMIN = "admin",
     DRIVER = "driver",
     USER = "user"
}

export interface LogoutRequest {
     userId: string;
     sessionId: string;
     logoutAllDevices: boolean;
}

export interface LoginResponse extends BaseResponse {
     sessionId?: string;
     authToken?: string;
     user?: User;
}

interface User {
     userId: string;
     role: Role;
     email: string;
}

interface SessionId {
     sessionId: string;
}

interface Token {
     authToken: string;
}