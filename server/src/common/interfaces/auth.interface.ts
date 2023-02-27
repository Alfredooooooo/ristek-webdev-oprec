export interface JWTPayload {
  sub: string;
  email: string;
}

export interface RegisterInterface {
  email: string;
  fullName: string;
  password: string;
  bio: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}
