import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../../application/use-cases/auth/register-user.use-case.js";
import { LoginUserUseCase } from "../../../application/use-cases/auth/login-user.use-case.js";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, email, password } = req.body as {
        nombre: string;
        email: string;
        password: string;
      };

      const result = await this.registerUseCase.execute({ nombre, email, password });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };

      const result = await this.loginUseCase.execute({ email, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
