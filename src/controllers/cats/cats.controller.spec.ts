import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreateCatDto } from '../../models/create-cat.dto';
import { Cat, CatDocument } from '../../schemas/cat.schema';
import { CatsService } from '../../services/cats/cats.service';
import { ErrorDomainService } from '../../services/log/error-domain.service';
import { CatsController } from './cats.controller';

describe('CatsController', () => {
  let appController: CatsController;
  let catsService: CatsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        CatsService,
        ErrorDomainService,
        { provide: getModelToken(Cat.name), useValue: jest.fn() },
      ],
    }).compile();
    catsService = app.get<CatsService>(CatsService);
    appController = app.get<CatsController>(CatsController);
  });

  it('should return an array of cats', async () => {
    const result = [
      {
        _id: new Types.ObjectId('6590214c754d1e36278d8553'),
        name: 'Osvaldo',
        age: 15,
        breed: 'N/A',
        __v: 0,
      },
    ] as CatDocument[];
    jest
      .spyOn(catsService, 'findAll')
      .mockImplementation(() => Promise.resolve(result));

    expect(await appController.finAllCats()).toBe(result);
  });
  it('should return by id of cats', async () => {
    const result = {
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      name: 'Osvaldo',
      age: 15,
      breed: 'N/A',
      __v: 0,
    } as CatDocument;

    jest
      .spyOn(catsService, 'findById')
      .mockImplementation(() => Promise.resolve(result));

    expect(await appController.findCat('6590214c754d1e36278d8553')).toBe(
      result,
    );
  });

  it('should create and return a cat', async () => {
    const createCatDto = new CreateCatDto('Test Cat', 3, 'Test Breed');
    const createdCat = {
      ...createCatDto,
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      __v: 0,
    } as CatDocument;

    jest
      .spyOn(catsService, 'create')
      .mockImplementation(async () => createdCat);

    expect(await appController.createCat(createCatDto)).toEqual(createdCat);
  });
});
