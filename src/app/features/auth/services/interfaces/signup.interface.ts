export interface BaseResponse {
     success : boolean;
     message : string;
}

export interface ProcessCheckResponse {
     accountExists: boolean;
     processExists: boolean;
     process?: {
          id: string;
          expiresAt: string;
     };
}

export function isProcessCheckResponse(response: any): response is ProcessCheckResponse {
     return typeof response.accountExists === 'boolean' &&
          typeof response.processExists === 'boolean';
}

export interface RegistrationFormData extends Partial<DriverReg> {
     role: 'USER' | 'DRIVER';
     name: string;
     email: string;
     phone: string;
     password: string;
}

export interface DriverReg {
     license: string;
     experience: number;
     profilePhoto: string | ArrayBuffer | null;
}

export interface RegistrationProgressResponse extends BaseResponse {
     processId: string;
}

export interface LoginResponse extends BaseResponse {
     user: {
          userId: string;
          email: string;
          name: string;
          role: 'user' | 'driver' | 'admin';
          status: boolean;
     };
     authToken: string;
     sessionId: string;
}

export interface VerifyReg {
     otp: string;
     processId: string;
     userAgent: string;
}