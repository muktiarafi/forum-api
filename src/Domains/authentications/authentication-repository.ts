export interface AuthenticationRepository {
  addToken(token: string): Promise<void>;
  deleteToken(token: string): Promise<void>;
  checkAvailabilityToken(token: string): Promise<void>;
}
