import { User } from '../models/User'; // Adjust the import path as necessary

declare global {
  namespace Express {
    interface Request {
      user?:{
      id: string;
      name: string;
      email: string;
      password: string;
      mobile: number;
      online: boolean;
      } 
    }
  }
}