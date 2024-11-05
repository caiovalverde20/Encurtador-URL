import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signup a user successfully', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    const hashedPassword = await bcrypt.hash('password', 10);

    jest.spyOn(userRepository, 'create').mockReturnValue({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User);

    jest.spyOn(userRepository, 'save').mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await service.signup('test@example.com', 'password');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email', 'test@example.com');
    expect(user).not.toHaveProperty('password');
  });

  it('should validate a user with correct credentials', async () => {
    const hashedPassword = await bcrypt.hash('password', 10);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const token = await service.validateUser('test@example.com', 'password');
    expect(token).toBe('test-jwt-token');
  });

  it('should throw error for incorrect credentials', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.validateUser('wrong@example.com', 'password')).rejects.toThrow();
  });
});
