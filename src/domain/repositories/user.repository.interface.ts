import { User } from "../entities/user.entity.js";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: {
    nombre: string;
    email: string;
    password: string;
    role?: "admin" | "user";
  }): Promise<User>;
}
