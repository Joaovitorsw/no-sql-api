import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCatDto } from '../../models/create-cat.dto';
import { Cat } from '../../schemas/cat.schema';
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
        _id: {
          $oid: '658e33a4e70063cbca330a79',
        },
        name: 'Osvaldo',
        age: 2,
        breed: 'Siamês gato',
        __v: 0,
      },
    ];
    jest
      .spyOn(catsService, 'findAll')
      .mockImplementation(() => Promise.resolve(result));

    expect(await appController.finAllCats()).toBe(result);
  });

  it('should create and return a cat', async () => {
    const createCatDto = new CreateCatDto('Test Cat', 3, 'Test Breed');
    const createdCat = {
      ...createCatDto,
      _id: 'some-id',
      __v: 0,
    };

    jest
      .spyOn(catsService, 'create')
      .mockImplementation(async () => createdCat);

    expect(await appController.createCat(createCatDto)).toEqual(createdCat);
  });
});
