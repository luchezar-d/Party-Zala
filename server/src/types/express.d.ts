import { Types } from "mongoose";

declare global {
  namespace Express {
    interface AuthUser {
      _id: Types.ObjectId | string;
      email: string;
      role?: string;
    }
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
