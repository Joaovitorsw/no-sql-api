import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsController } from './controllers/cats/cats.controller';
import { Cat, CatSchema } from './schemas/cat.schema';
import { AppService } from './services/app/app.service';
import { CatsService } from './services/cats/cats.service';

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
  exports: [AppService, CatsService],
  providers: [AppService, CatsService],
})
export class AppModule {}
