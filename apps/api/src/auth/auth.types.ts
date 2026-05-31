export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
