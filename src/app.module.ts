import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthController } from './controllers/auth/auth.controller';
import { PetsController } from './controllers/pets/pets.controller';
import { RolesController } from './controllers/roles/roles.controller';
import { JwtAuthGuard } from './guards/auth.guard';
import { FilesRepository } from './repository/files/files.repository';
import { PetsRepository } from './repository/pets/pets.repository';
import { RolesRepository } from './repository/roles/roles.repository';
import { UsersRepository } from './repository/users/users.repository';
import { Files, FilesSchema } from './schemas/files.schema';
import { Pet, PetSchema } from './schemas/pets.schema';
import { Roles, RolesSchema } from './schemas/roles.schema';
import { User, UserSchema } from './schemas/users.schema';
import { AuthService } from './services/auth/auth.service';
import { ErrorDomainService } from './services/error-domain/error-domain.service';
import { FilesService } from './services/files/files.service';
import { PetsService } from './services/pets/pets.service';
import { RolesService } from './services/roles/roles.service';
import { JwtStrategy } from './strategies/jwt.strategy';

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
        name: Pet.name,
        useFactory: (connection: Connection) => {
          const schema = PetSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            id: 'pet_counter',
            inc_field: '_id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: Files.name,
        useFactory: (connection: Connection) => {
          const schema = FilesSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            id: 'files_counter',
            inc_field: '_id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DB_URI,
        dbName: 'pet-app',
      }),
    }),
    NestjsFormDataModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
  ],
  controllers: [PetsController, AuthController, RolesController],

  providers: [
    RolesService,
    FilesService,
    FilesRepository,
    RolesRepository,
    PetsService,
    AuthService,
    ErrorDomainService,
    PetsRepository,
    UsersRepository,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
