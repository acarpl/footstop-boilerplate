import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Res,
  Get,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorators/get-user.decorator";
import { User } from "../users/entities/user.entity";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };
  }

  @Post("register")
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.registerAndLogin(createUserDto);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };
    response.cookie("accessToken", accessToken, cookieOptions);
    response.cookie("refreshToken", refreshToken, cookieOptions);

    return { message: "Registration successful", user, accessToken };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const tokens = await this.authService.login(loginDto);

    const cookieOptions = this.getCookieOptions();
    response.cookie("accessToken", tokens.accessToken, cookieOptions);
    response.cookie("refreshToken", tokens.refreshToken, cookieOptions);

    return { message: "Login successful", accessToken: tokens.accessToken };
  }

  @Post("logout")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.logout(user.id_user);
    response.clearCookie("accessToken");
    response.clearCookie("refreshToken");
    return { message: "Logout successful" };
  }

  @Post("refresh")
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = req.user as any;
    const tokens = await this.authService.refreshTokens(
      user.sub,
      user.refreshToken
    );

    const cookieOptions = this.getCookieOptions();
    response.cookie("accessToken", tokens.accessToken, cookieOptions);
    response.cookie("refreshToken", tokens.refreshToken, cookieOptions);

    return { message: "Tokens refreshed", accessToken: tokens.accessToken };
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  getProfile(@GetUser() user: User) {
    return user;
  }

  // Endpoint ini tidak perlu login
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body("token") token: string,
    @Body("password") password: string
  ) {
    return this.authService.resetPassword(token, password);
  }
}
