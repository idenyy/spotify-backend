export enum UserRole {
  REGULAR = 'REGULAR',
  ADMIN = 'ADMIN',
}

export enum AuthMethod {
  CREDENTIALS = 'CREDENTIALS',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APPLE = 'APPLE',
}

export enum TokenType {
  VERIFICATION = 'VERIFICATION',
  TWO_FACTOR = 'TWO_FACTOR',
  PASSWORD_RESET = 'PASSWORD_RESET',
}
