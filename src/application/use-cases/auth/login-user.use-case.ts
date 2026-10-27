import { IUserRepository } from "../../../domain/repositories/user.repository.interface.js";
import { IPasswordHasher } from "../../../domain/services/password-hasher.interface.js";
import { ITokenService } from "../../../domain/services/token-service.interface.js";
import { SafeUser } from "../../../domain/entities/user.entity.js";
import { UnauthorizedError } from "../../errors/application-errors.js";

// Hash bcrypt de relleno (costo 10) para ejecutar compare y mitigar ataques de temporización (timing attack)
const DUMMY_HASH = "$2b$10$/vuAXrqo7ae3sSI8djqdjerQif.5uULK2us24WrkcO0NoH76tXV0e";

export interface LoginUserInput {
  email: string;
  password: string;
}

export interface LoginUserOutput {
  token: string;
  user: SafeUser;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    const cleanEmail = input.email.toLowerCase().trim();
    const user = await this.userRepository.findByEmail(cleanEmail);

    // Mensaje genérico de seguridad: mismo 401 y mismo mensaje
    // Si el usuario no existe, se compara contra el hash de relleno para no revelar por tiempo de respuesta si el email existe
    if (!user || !user.password) {
      await this.passwordHasher.compare(input.password, DUMMY_HASH);
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const isValidPassword = await this.passwordHasher.compare(input.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    const token = this.tokenService.generateToken({
      id: user.id,
      role: user.role
    });

    const safeUser: SafeUser = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return { token, user: safeUser };
  }
}
