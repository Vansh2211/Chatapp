import { User } from '../models/User'; // Adjust the import path as necessary

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}