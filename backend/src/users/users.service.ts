import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    return this.usersRepository.findOne({ where: { id } });
  }

  async calculateReelEarnings(userId: number, views: number): Promise<number> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return 0;

    // Update total views
    user.totalViews += views;
    
    // Update creator level based on total views
    if (user.totalViews >= 20000) {
      user.creatorLevel = 'gold';
    } else if (user.totalViews >= 5000) {
      user.creatorLevel = 'silver';
    } else if (user.totalViews >= 1000) {
      user.creatorLevel = 'bronze';
    }

    // Calculate earnings based on views
    let earnings = 0;
    if (views >= 20000) {
      earnings = 30; // Gold tier: $30 per reel
    } else if (views >= 5000) {
      earnings = 15; // Silver tier: $15 per reel
    } else if (views >= 1000) {
      earnings = 5;  // Bronze tier: $5 per reel
    }

    // Viral content bonus (100,000+ views)
    if (views >= 100000) {
      earnings += 50; // Additional $50 bonus
    }

    // Update user's reel count
    user.reelsCount += 1;
    await this.usersRepository.save(user);

    return earnings;
  }
}