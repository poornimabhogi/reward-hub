import { Controller, Get, UseGuards } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

@Controller('earnings')
@UseGuards(JwtAuthGuard)
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @Get()
  async getUserEarnings(@User() user: User) {
    return this.earningsService.getUserEarnings(user.id);
  }

  @Get('pending')
  async getPendingPayouts(@User() user: User) {
    return this.earningsService.getPendingPayouts(user.id);
  }
}