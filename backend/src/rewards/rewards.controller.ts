import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('balance')
  async getRewardBalance(@User() user: User) {
    return this.rewardsService.getRewardBalance(user.id);
  }

  @Get('history')
  async getRewardHistory(@User() user: User) {
    return this.rewardsService.getRewardHistory(user.id);
  }

  @Post('engagement')
  async rewardEngagement(
    @User() user: User,
    @Body() data: { action: 'like' | 'comment' | 'share' }
  ) {
    return this.rewardsService.rewardForEngagement(user.id, data.action);
  }
}