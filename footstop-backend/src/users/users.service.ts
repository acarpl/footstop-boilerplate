import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AdminUpdateUserDto } from "./dto/admin-update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Membuat user baru, otomatis hash password.
   */
  async create(userLikeObject: DeepPartial<User>): Promise<User> {
    console.log("🔧 UsersService.create() called with:", {
      email: userLikeObject.email,
      username: userLikeObject.username,
      hasPassword: !!userLikeObject.password,
      passwordLength: userLikeObject.password?.length || 0,
    });

    const existing = await this.userRepository.findOneBy({
      email: userLikeObject.email,
    });
    if (existing) throw new BadRequestException("Email is already in use.");

    if (!userLikeObject.id_role) userLikeObject.id_role = 2;

    if (!userLikeObject.phone_number) {
      throw new BadRequestException("phone_number is required");
    }

    if (!userLikeObject.role) {
      userLikeObject.role = { id_role: 2 };
    }

    // Hash password hanya jika ada dan belum di-hash
    if (userLikeObject.password) {
      console.log("🔑 Processing password...");

      // Cek apakah sudah berupa hash bcrypt
      const isBcryptHash = userLikeObject.password.startsWith("$2");

      if (!isBcryptHash) {
        console.log("🔑 Password is plain text, hashing with bcrypt...");
        const originalPassword = userLikeObject.password;
        userLikeObject.password = await bcrypt.hash(
          userLikeObject.password,
          10
        );

        console.log("✅ Password hashed successfully:", {
          originalLength: originalPassword.length,
          hashedLength: userLikeObject.password.length,
          isValidBcryptFormat: userLikeObject.password.startsWith("$2"),
        });
      } else {
        console.log("⚠️ Password already appears to be hashed, skipping...");
      }
    }

    const user = this.userRepository.create(userLikeObject);
    const savedUser = await this.userRepository.save(user);

    console.log("✅ User saved successfully with ID:", savedUser.id_user);

    return savedUser;
  }

  async findOneById(id_user: number): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { id_user },
      relations: ["role"],
    });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    console.log("🔍 Finding user by email:", email);

    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .addSelect("user.password") // Pastikan password di-select
      .addSelect("user.refreshTokenHash") // Pastikan refresh token hash juga di-select
      .where("user.email = :email", { email })
      .getOne();

    if (user) {
      console.log("✅ User found:", {
        id: user.id_user,
        username: user.username,
        email: user.email,
        hasPassword: !!user.password,
        passwordLength: user.password?.length || 0,
        roleName: user.role?.nama_role,
      });
    } else {
      console.log("❌ User not found for email:", email);
    }

    return user;
  }

  /**
   * Update user (termasuk relasi role jika dikirim)
   */
  async update(
    id_user: number,
    updateUserDto: UpdateUserDto | AdminUpdateUserDto
  ): Promise<User> {
    // Hanya preload user data dari DTO
    const preloadPayload: any = { id_user, ...updateUserDto };

    // Jika adminUpdateUserDto dan ada id_role, set role
    if ("id_role" in updateUserDto && updateUserDto.id_role) {
      preloadPayload.role = { id_role: updateUserDto.id_role };
    }

    const user = await this.userRepository.preload(preloadPayload);
    if (!user)
      throw new NotFoundException(`User with ID #${id_user} not found.`);

    return this.userRepository.save(user);
  }

  /**
   * Update refresh token hash menggunakan bcrypt
   */
  async updateRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    console.log("🔄 Updating refresh token for user:", userId);
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshTokenHash: hashed,
    } as any);
    console.log("✅ Refresh token updated successfully");
  }

  /**
   * Menghapus refresh token hash saat logout
   */
  async removeRefreshToken(userId: number): Promise<void> {
    console.log("🗑️ Removing refresh token for user:", userId);
    await this.userRepository.update(userId, { refreshTokenHash: null });
    console.log("✅ Refresh token removed successfully");
  }

  async remove(id_user: number): Promise<void> {
    const result = await this.userRepository.delete(id_user);
    if (result.affected === 0)
      throw new NotFoundException(`User with ID #${id_user} not found.`);
  }

  async findAllPaginated({ page, limit }: { page: number; limit: number }) {
    const skip = (page - 1) * limit;
    const users = await this.userRepository.find({
      skip,
      take: limit,
      relations: ["role"],
    });
    const totalCount = await this.userRepository.count();
    return {
      data: users,
      meta: { page, limit, totalCount, relations: ["role", "address"] },
    };
  }
}
