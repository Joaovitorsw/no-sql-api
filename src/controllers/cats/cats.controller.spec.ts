import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
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
        _id: 1,
        name: 'Osvaldo',
        birthDate: new Date(),
        photoUrl: 'N/A',
        owner: 1,
      },
    ] as CatDocument[];
    const response = {
      items: result,
      total: result.length,
      page: 1,
      size: 10,
    };
    jest
      .spyOn(catsService, 'findAll')
      .mockImplementation(() => Promise.resolve(response));

    expect(await appController.findAllCats()).toBe(response);
  });
  it('should return by id of cats', async () => {
    const result = {
      _id: 1,
      name: 'Osvaldo',
      birthDate: new Date(),
      photoUrl: 'N/A',
      owner: 1,
    } as CatDocument;

    jest
      .spyOn(catsService, 'findById')
      .mockImplementation(() => Promise.resolve(result));

    expect(await appController.findCat(1)).toBe(result);
  });

  it('should create and return a cat', async () => {
    const catDto = new CatDto('Test Cat', new Date(), 'teste.jpg', 1);
    const createdCat = {
      ...catDto,
      _id: 1,
    } as CatDocument;
    jest
      .spyOn(catsService, 'createCat')
      .mockImplementation(async () => createdCat);

    expect(await appController.createCat({}, catDto)).toEqual(createdCat);
  });
  it('should create and return a cat', async () => {
    const catDto = new CatDto('Test Cat', new Date(), 'teste.jpg', 1);
    const createdCat = {
      ...catDto,
      _id: 1,
    } as CatDocument;

    jest
      .spyOn(catsService, 'updateCat')
      .mockImplementation(async () => createdCat);

    expect(await appController.updateCat({}, catDto)).toEqual(createdCat);
  });
  it('should create and return a cat', async () => {
    const catDto = new CatDto('Test Cat', new Date(), 'teste.jpg', 1);
    const createdCat = {
      ...catDto,
      _id: 1,
    } as CatDocument;

    jest
      .spyOn(catsService, 'removeById')
      .mockImplementation(async () => createdCat);

    expect(await appController.removeCat(1)).toEqual(createdCat);
  });
});
