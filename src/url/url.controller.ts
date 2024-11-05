import { Controller, Post, Body, Param, Get, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { Response } from 'express';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(@Body('originalUrl') originalUrl: string): Promise<Url> {
    return this.urlService.shortenUrl(originalUrl);
  }

  @Get(':shortUrl')
  async redirectToOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Res() res: Response,
  ): Promise<void> {
    const originalUrl = await this.urlService.getOriginalUrlAndIncrementClick(shortUrl);
    return res.redirect(originalUrl);
  }
}
