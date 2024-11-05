import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { AuthenticatedRequest } from './authenticated-request.interface';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UrlController', () => {
  let controller: UrlController;
  let service: UrlService;

  const mockUrlService = {
    shortenUrl: jest.fn(),
    getUserUrls: jest.fn(),
    getOriginalUrlAndIncrementClick: jest.fn(),
    deleteUserUrl: jest.fn(),
    updateUserUrl: jest.fn(),
  };

  const mockUrl = {
    id: 1,
    originalUrl: 'https://example.com',
    shortUrl: 'abc123',
    clickCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    userId: 1,
  };

  const mockRequest = (user: User | null): Partial<AuthenticatedRequest> => ({
    user: user,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UrlController>(UrlController);
    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('shortenUrl', () => {
    it('should shorten a URL successfully', async () => {
      mockUrlService.shortenUrl.mockResolvedValue(mockUrl);
      const result = await controller.shortenUrl('https://example.com', mockRequest(mockUser) as AuthenticatedRequest);
      expect(result).toEqual(mockUrl);
      expect(mockUrlService.shortenUrl).toHaveBeenCalledWith('https://example.com', mockUser);
    });
  });

  describe('listUrls', () => {
    it('should return a list of URLs for the authenticated user', async () => {
      mockUrlService.getUserUrls.mockResolvedValue([mockUrl]);
      const result = await controller.listUrls(mockRequest(mockUser) as AuthenticatedRequest);
      expect(result).toEqual([mockUrl]);
      expect(mockUrlService.getUserUrls).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw an UnauthorizedException if user is not authenticated', async () => {
      await expect(controller.listUrls(mockRequest(null) as AuthenticatedRequest)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getOriginalUrl', () => {
    it('should return the original URL for a valid shortened URL', async () => {
      mockUrlService.getOriginalUrlAndIncrementClick.mockResolvedValue(mockUrl.originalUrl);
      const result = await controller.getOriginalUrl('abc123', mockRequest(mockUser) as AuthenticatedRequest);
      expect(result).toEqual({ originalUrl: mockUrl.originalUrl });
      expect(mockUrlService.getOriginalUrlAndIncrementClick).toHaveBeenCalledWith('abc123', mockUser.id);
    });
  });

  describe('deleteUrl', () => {
    it('should delete a URL successfully', async () => {
      mockUrlService.deleteUserUrl.mockResolvedValue(undefined);
      const result = await controller.deleteUrl('abc123', mockRequest(mockUser) as AuthenticatedRequest);
      expect(result).toEqual({ message: 'URL successfully deleted' });
      expect(mockUrlService.deleteUserUrl).toHaveBeenCalledWith('abc123', mockUser.id);
    });
  });

  describe('updateUrl', () => {
    it('should update a URL successfully', async () => {
      const updatedUrl = { ...mockUrl, originalUrl: 'https://newurl.com' };
      mockUrlService.updateUserUrl.mockResolvedValue(updatedUrl);

      const result = await controller.updateUrl('abc123', 'https://newurl.com', mockRequest(mockUser) as AuthenticatedRequest);
      expect(result).toEqual({ message: 'URL successfully updated', updatedUrl });
      expect(mockUrlService.updateUserUrl).toHaveBeenCalledWith('abc123', mockUser.id, 'https://newurl.com');
    });
  });
});
