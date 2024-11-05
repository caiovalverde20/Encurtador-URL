import { Controller, Post, Body, Param, Get, Res, Req, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { Response } from 'express';
import { AuthenticatedRequest } from './authenticated-request.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  async shortenUrl(@Body('originalUrl') originalUrl: string, @Req() req: AuthenticatedRequest): Promise<Url> {
    const user = req.user ? req.user : null;
    return this.urlService.shortenUrl(originalUrl, user);
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
