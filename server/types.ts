export interface LoginRequest {
  type: 'student' | 'teacher';
  id: string;
  secret: string;
}

export interface LoginResponse {
  success: boolean;
  type: 'student' | 'teacher';
  reason?: string;
}

export interface RegisterRequest {
  id: string;
  secret: string;
}

export interface RegisterResponse {
  success: boolean;
  reason?: string;
}

export interface JWTPayload {
  type: 'student' | 'teacher';
  id: string;
  gameCode?: string;
}

/** An object that holds the result of PBKDF2 derived key generation. */
export interface Keystore {
  salt: Buffer;
  key: Buffer;
  iterations: number;
}

// export enum ConnectionType {
//   teacher,
//   student,
// }

export type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH';
