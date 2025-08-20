// users.controller.ts
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Admin bisa melihat semua user
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAll(
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe()) page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number,
  ) {
    return this.usersService.findAllPaginated({ page, limit });
  }

  // ✅ User update profil sendiri
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  updateMyProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user.id_user, updateUserDto);
  }

  // ✅ Admin bisa bikin user manual (contoh: admin register admin lain atau staff)
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async createUserByAdmin(@Body() createUserDto: CreateUserDto) {
    // Kalau admin tidak isi id_role → default ke 2 (admin)
    return this.usersService.create(createUserDto);
  }

  // ✅ Admin update user lain
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  updateUserByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() adminUpdateUserDto: AdminUpdateUserDto,
  ) {
    return this.usersService.update(id, adminUpdateUserDto);
  }

  // ✅ Admin hapus user
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
