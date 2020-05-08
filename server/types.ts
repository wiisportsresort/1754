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
  recaptchaToken: string;
}

export interface RegisterResponse {
  success: boolean;
  reason?: string;
  code: 'ERR-ALREADY-REGISTERED' | 'ERR-TIMED-OUT' | 'SUCCESS';
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

export interface Gamestore {
  state: {
    france: number[];
    britain: number[];
    cherokee: number[];
    shawnee: number[];
    miami: number[];
    ojibwe: number[];
    mohawk: number[];
  }
  transfers: GameHexTransfer[];
}

export interface GameHexTransfer {

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
