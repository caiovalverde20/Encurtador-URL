    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { JwtModule } from '@nestjs/jwt';
    import { PassportModule } from '@nestjs/passport';
    import { ConfigModule, ConfigService } from '@nestjs/config';
    import { User } from '../user/user.entity';
    import { AuthService } from './auth.service';
    import { AuthController } from './auth.controller';
    import { JwtStrategy } from './jwt.strategy';

    @Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET') || 'defaultSecretKey',
            signOptions: { expiresIn: '1h' },
        }),
        }),
        PassportModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    })
    export class AuthModule {}
