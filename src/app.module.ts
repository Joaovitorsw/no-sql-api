import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './controllers/cats/cats.controller';
import { Cat, CatSchema } from './schemas/cat.schema';
import { CatsService } from './services/cats/cats.service';
import { ErrorDomainService } from './services/error-domain/error-domain.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/local',
      }),
    }),
  ],
  controllers: [CatsController],
  exports: [CatsService, ErrorDomainService],
  providers: [CatsService, ErrorDomainService],
})
export class AppModule {}
