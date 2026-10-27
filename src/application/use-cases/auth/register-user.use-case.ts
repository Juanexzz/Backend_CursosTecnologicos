import { IUserRepository } from "../../../domain/repositories/user.repository.interface.js";
import { IPasswordHasher } from "../../../domain/services/password-hasher.interface.js";
import { SafeUser } from "../../../domain/entities/user.entity.js";
import { ConflictError } from "../../errors/application-errors.js";

export interface RegisterUserInput {
  nombre: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(input: RegisterUserInput): Promise<{ user: SafeUser }> {
    const cleanEmail = input.email.toLowerCase().trim();
    const existing = await this.userRepository.findByEmail(cleanEmail);

    if (existing) {
      throw new ConflictError("El email ya se encuentra registrado", [
        { field: "email", message: "Este email ya está registrado" }
      ]);
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    const newUser = await this.userRepository.create({
      nombre: input.nombre.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "user" // Regla estricta: siempre "user"
    });

    const safeUser: SafeUser = {
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    return { user: safeUser };
  }
}
