import { Controller, Post, Body, Param, Get, Req, UseGuards, UnauthorizedException, Delete, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { AuthenticatedRequest } from './authenticated-request.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('URL')
@ApiBearerAuth()
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  @ApiOperation({ summary: 'Shorten a new URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        originalUrl: { type: 'string', description: 'The original URL to shorten' },
      },
      required: ['originalUrl'],
    },
  })
  @ApiResponse({ status: 201, description: 'URL shortened successfully', type: Url })
  async shortenUrl(@Body('originalUrl') originalUrl: string, @Req() req: AuthenticatedRequest): Promise<Url> {
    const user = req.user ? req.user : null;
    return this.urlService.shortenUrl(originalUrl, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all URLs created by the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of URLs', type: [Url] })
  async listUrls(@Req() req: AuthenticatedRequest): Promise<Url[]> {
    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.urlService.getUserUrls(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':shortUrl')
  @ApiOperation({ summary: 'Get the original URL for a shortened URL' })
  @ApiParam({ name: 'shortUrl', description: 'The shortened URL identifier' })
  @ApiResponse({ status: 200, description: 'Original URL retrieved successfully', schema: { type: 'object', properties: { originalUrl: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized access to the URL' })
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
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiParam({ name: 'shortUrl', description: 'The shortened URL identifier' })
  @ApiResponse({ status: 200, description: 'URL successfully deleted', schema: { type: 'object', properties: { message: { type: 'string' } } } })
  async deleteUrl(@Param('shortUrl') shortUrl: string, @Req() req: AuthenticatedRequest): Promise<{ message: string }> {
    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }
    await this.urlService.deleteUserUrl(shortUrl, req.user.id);
    return { message: 'URL successfully deleted' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':shortUrl')
  @ApiOperation({ summary: 'Update the original URL of a shortened URL' })
  @ApiParam({ name: 'shortUrl', description: 'The shortened URL identifier' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newOriginalUrl: { type: 'string', description: 'The new original URL to update' },
      },
      required: ['newOriginalUrl'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'URL successfully updated',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'URL successfully updated' },
      },
    },
  })
  async updateUrl(
    @Param('shortUrl') shortUrl: string,
    @Body('newOriginalUrl') newOriginalUrl: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ message: string; updatedUrl: Url }> {
    if (!req.user) {
      throw new UnauthorizedException('Authentication required');
    }
  
    const updatedUrl = await this.urlService.updateUserUrl(shortUrl, req.user.id, newOriginalUrl);
    return { message: 'URL successfully updated', updatedUrl };
  }
}
