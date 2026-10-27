import { IUserRepository } from "../../../domain/repositories/user.repository.interface.js";
import { SafeUser } from "../../../domain/entities/user.entity.js";
import { UnauthorizedError } from "../../errors/application-errors.js";

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: number): Promise<{ user: SafeUser }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError("Usuario no encontrado");
    }

    const safeUser: SafeUser = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: safeUser };
  }
}
