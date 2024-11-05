import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  async shortenUrl(originalUrl: string): Promise<Url> {
    const shortUrl = this.generateShortCode();
    const url = this.urlRepository.create({ originalUrl, shortUrl });
    return await this.urlRepository.save(url);
  }

  private generateShortCode(): string {
    return Math.random().toString(36).substring(2, 8);
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
}
