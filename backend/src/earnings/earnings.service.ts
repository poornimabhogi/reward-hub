import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Earning } from './earning.entity';
import { User } from '../users/user.entity';

@Injectable()
export class EarningsService {
  // In-memory store for earnings status (in production, this should be in the database)
  private earningsStatusMap: Map<number, boolean> = new Map();

  constructor(
    @InjectRepository(Earning)
    private earningsRepository: Repository<Earning>,
  ) {}

  async addEarning(user: User, amount: number, source: string): Promise<Earning> {
    const earning = this.earningsRepository.create({
      user,
      amount,
      source,
    });
    return this.earningsRepository.save(earning);
  }

  async getUserEarnings(userId: number): Promise<{ total: number; earnings: Earning[] }> {
    const earnings = await this.earningsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    const total = earnings.reduce((sum, earning) => sum + Number(earning.amount), 0);

    return {
      total,
      earnings,
    };
  }

  async getPendingPayouts(userId: number): Promise<number> {
    const result = await this.earningsRepository
      .createQueryBuilder('earning')
      .where('earning.user.id = :userId', { userId })
      .andWhere('earning.isPaid = false')
      .select('SUM(earning.amount)', 'total')
      .getRawOne();

    return Number(result.total) || 0;
  }

  async toggleEarnings(userId: number, enabled: boolean): Promise<{ enabled: boolean }> {
    this.earningsStatusMap.set(userId, enabled);
    return { enabled };
  }

  async getEarningsStatus(userId: number): Promise<{ enabled: boolean }> {
    return { enabled: this.earningsStatusMap.get(userId) || false };
  }
}