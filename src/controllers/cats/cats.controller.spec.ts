import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CatDto } from '../../models/cat.dto';
import { CatsRepository } from '../../repository/cats/cats.repository';
import { UsersRepository } from '../../repository/users/users.repository';
import { Cat, CatDocument } from '../../schemas/cats.schema';
import { User } from '../../schemas/users.schema';
import { CatsService } from '../../services/cats/cats.service';
import { ErrorDomainService } from '../../services/error-domain/error-domain.service';
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
        CatsRepository,
        UsersRepository,
        { provide: getModelToken(Cat.name), useValue: jest.fn() },
        { provide: getModelToken(User.name), useValue: jest.fn() },
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
        photoUrl: 'N/A',
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
      photoUrl: 'N/A',
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
    const catDto = new CatDto('Test Cat', 3, 'Test Breed');
    const createdCat = {
      ...catDto,
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      __v: 0,
    } as CatDocument;

    jest
      .spyOn(catsService, 'create')
      .mockImplementation(async () => createdCat);

    expect(await appController.createCat(catDto)).toEqual(createdCat);
  });
  it('should create and return a cat', async () => {
    const catDto = new CatDto('Test Cat', 3, 'Test Breed');
    const createdCat = {
      ...catDto,
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      __v: 0,
    } as CatDocument;

    jest
      .spyOn(catsService, 'update')
      .mockImplementation(async () => createdCat);

    expect(await appController.updateCat(catDto)).toEqual(createdCat);
  });
  it('should create and return a cat', async () => {
    const catDto = new CatDto('Test Cat', 3, 'Test Breed');
    const createdCat = {
      ...catDto,
      _id: new Types.ObjectId('6590214c754d1e36278d8553'),
      __v: 0,
    } as CatDocument;

    jest
      .spyOn(catsService, 'removeById')
      .mockImplementation(async () => createdCat);

    expect(
      await appController.removeCat(
        new Types.ObjectId('6590214c754d1e36278d8553'),
      ),
    ).toEqual(createdCat);
  });
});
