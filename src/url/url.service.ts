import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { User } from '../user/user.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async shortenUrl(originalUrl: string, user?: User): Promise<Url> {
    const shortUrl = this.generateShortCode();
    const url = this.urlRepository.create({
      originalUrl,
      shortUrl,
      userId: user ? user.id : null,
    });
    return await this.urlRepository.save(url);
  }


  async getUserUrls(userId: number): Promise<Url[]> {
    return this.urlRepository
      .createQueryBuilder('url')
      .where('url.userId = :userId', { userId })
      .andWhere('url.deletedAt IS NULL')
      .getMany();
  }

  async getOriginalUrlAndIncrementClick(shortUrl: string): Promise<string> {
    const url = await this.urlRepository.findOne({
      where: { shortUrl, deletedAt: null },
    });

    if (!url) {
      throw new NotFoundException('URL not found or has been deleted');
    }

    url.clickCount += 1;
    await this.urlRepository.save(url);
    return url.originalUrl;
  }

  async deleteUserUrl(shortUrl: string, userId: number): Promise<void> {
    const url = await this.findUrlByUser(shortUrl, userId);
    url.deletedAt = new Date();
    await this.urlRepository.save(url);
  }

  private generateShortCode(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  private async findUrlByUser(shortUrl: string, userId: number): Promise<Url> {
    const url = await this.urlRepository.findOne({
      where: { shortUrl, userId, deletedAt: null },
    });
  
    if (!url) {
      throw new NotFoundException('URL not found or not owned by the user');
    }
  
    return url;
  }

}