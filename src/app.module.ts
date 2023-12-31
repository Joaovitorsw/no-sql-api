import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthController } from './controllers/auth/auth.controller';
import { CatsController } from './controllers/cats/cats.controller';
import { RolesController } from './controllers/roles/roles.controller';
import { CatsRepository } from './repository/cats/cats.repository';
import { RolesRepository } from './repository/roles/roles.repository';
import { UsersRepository } from './repository/users/users.repository';
import { Cat, CatSchema } from './schemas/cats.schema';
import { Roles, RolesSchema } from './schemas/roles.schema';
import { User, UserSchema } from './schemas/users.schema';
import { AuthService } from './services/auth/auth.service';
import { CatsService } from './services/cats/cats.service';
import { ErrorDomainService } from './services/error-domain/error-domain.service';
import { RolesService } from './services/roles/roles.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Roles.name,
        useFactory: (connection: Connection) => {
          const schema = RolesSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            id: 'roles_counter',
            inc_field: '_id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: (connection: Connection) => {
          const schema = UserSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            id: 'user_counter',
            inc_field: '_id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        useFactory: (connection: Connection) => {
          const schema = CatSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            id: 'cat_counter',
            inc_field: '_id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/cat-app',
      }),
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),
    NestjsFormDataModule,
  ],
  controllers: [CatsController, AuthController, RolesController],
  exports: [
    RolesService,
    RolesRepository,
    CatsService,
    AuthService,
    ErrorDomainService,
    CatsRepository,
    UsersRepository,
  ],
  providers: [
    RolesService,
    RolesRepository,
    CatsService,
    AuthService,
    ErrorDomainService,
    CatsRepository,
    UsersRepository,
  ],
})
export class AppModule {}
