export interface LoginData {
  type: 'student' | 'teacher';
  id: string;
  secret: string;
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
