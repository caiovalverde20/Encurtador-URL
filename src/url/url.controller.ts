import { Controller, Post, Body, Param, Get, Res, Req, UseGuards, UnauthorizedException, Delete } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get()
  async listUrls(@Req() req: AuthenticatedRequest): Promise<Url[]> {
    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.urlService.getUserUrls(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':shortUrl')
  async getOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ originalUrl: string }> {
    const userId = req.user ? req.user.id : undefined;
    const originalUrl = await this.urlService.getOriginalUrlAndIncrementClick(shortUrl, userId);
    return { originalUrl };
  }  

  @UseGuards(JwtAuthGuard)
  @Delete(':shortUrl')
  async deleteUrl(@Param('shortUrl') shortUrl: string, @Req() req: AuthenticatedRequest): Promise<{ message: string }> {
    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }
    await this.urlService.deleteUserUrl(shortUrl, req.user.id);
    return { message: 'URL successfully deleted' };
  }
}
