export interface AuthResponse {
  token: string;
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}