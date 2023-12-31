import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controllers/auth/auth.controller';
import { CatsController } from './controllers/cats/cats.controller';
import { CatsRepository } from './repository/cats/cats.repository';
import { UsersRepository } from './repository/users/users.repository';
import { Cat, CatSchema } from './schemas/cats.schema';
import { User, UserSchema } from './schemas/users.schema';
import { AuthService } from './services/auth/auth.service';
import { CatsService } from './services/cats/cats.service';
import { ErrorDomainService } from './services/error-domain/error-domain.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/local',
      }),
    }),
  ],
  controllers: [CatsController, AuthController],
  exports: [
    CatsService,
    AuthService,
    ErrorDomainService,
    CatsRepository,
    UsersRepository,
  ],
  providers: [
    CatsService,
    AuthService,
    ErrorDomainService,
    CatsRepository,
    UsersRepository,
  ],
})
export class AppModule {}
