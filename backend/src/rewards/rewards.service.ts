import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async addRewardPoints(userId: number, points: number, reason: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    user.rewardPoints += points;
    user.rewardHistory = [
      ...user.rewardHistory,
      {
        amount: points,
        reason,
        timestamp: new Date(),
      },
    ];

    return this.usersRepository.save(user);
  }

  async getRewardBalance(userId: number): Promise<number> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user?.rewardPoints || 0;
  }

  async getRewardHistory(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user?.rewardHistory || [];
  }

  // Reward distribution rules
  async rewardForReel(userId: number, views: number): Promise<void> {
    let points = 0;
    
    // Basic points for creating content
    points += 10;

    // Additional points based on views
    if (views >= 1000) points += 20;
    if (views >= 5000) points += 50;
    if (views >= 20000) points += 100;
    
    await this.addRewardPoints(userId, points, `Reel created with ${views} views`);
  }

  async rewardForDailyLogin(userId: number): Promise<void> {
    await this.addRewardPoints(userId, 5, 'Daily login bonus');
  }

  async rewardForEngagement(userId: number, action: 'like' | 'comment' | 'share'): Promise<void> {
    const pointsMap = {
      like: 1,
      comment: 3,
      share: 5,
    };

    await this.addRewardPoints(
      userId,
      pointsMap[action],
      `Engagement reward: ${action}`
    );
  }
}