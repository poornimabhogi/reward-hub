import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Param('id') id: number) {
    return this.usersService.findOne(id.toString());
  }

  @Post()
  async create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() userData: Partial<User>) {
    return this.usersService.update(id, userData);
  }

  // Admin-only endpoints
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('all')
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('admin/:id')
  async toggleAdminStatus(@Param('id') id: number, @Body() { isAdmin }: { isAdmin: boolean }) {
    return this.usersService.update(id, { isAdmin });
  }
}