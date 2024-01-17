import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PetDto } from '../../dtos/pet.dto';
import { PetsRepository } from '../../repository/pets/pets.repository';
import { UsersRepository } from '../../repository/users/users.repository';
import { Pet, PetDocument } from '../../schemas/pets.schema';
import { User } from '../../schemas/users.schema';
import { ErrorDomainService } from '../../services/error-domain/error-domain.service';
import { PetsService } from '../../services/pets/pets.service';
import { PetsController } from './pets.controller';

describe('PetsController', () => {
  let appController: PetsController;
  let petsService: PetsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PetsController],
      providers: [
        PetsService,
        ErrorDomainService,
        PetsRepository,
        UsersRepository,
        { provide: getModelToken(Pet.name), useValue: jest.fn() },
        { provide: getModelToken(User.name), useValue: jest.fn() },
      ],
    }).compile();
    petsService = app.get<PetsService>(PetsService);
    appController = app.get<PetsController>(PetsController);
  });

  it('should return an array of pets', async () => {
    const result = [
      {
        _id: 1,
        name: 'Osvaldo',
        birthDate: new Date(),
        photoUrl: 'N/A',
        owner: 1,
      },
    ] as PetDocument[];
    const response = {
      items: result,
      total: result.length,
      page: 1,
      size: 10,
    };
    jest
      .spyOn(petsService, 'findAll')
      .mockImplementation(() => Promise.resolve(response));

    expect(await appController.findAllPets()).toBe(response);
  });
  it('should return by id of pets', async () => {
    const result = {
      _id: 1,
      name: 'Osvaldo',
      birthDate: new Date(),
      photoUrl: 'N/A',
      owner: 1,
    } as PetDocument;

    jest
      .spyOn(petsService, 'findById')
      .mockImplementation(() => Promise.resolve(result));

    expect(await appController.findPet(1)).toBe(result);
  });

  it('should create and return a pet', async () => {
    const petDto = new PetDto('Test Pet', new Date(), 'teste.jpg', 1);
    const createdPet = {
      ...petDto,
      _id: 1,
    } as PetDocument;
    jest
      .spyOn(petsService, 'createPet')
      .mockImplementation(async () => createdPet);

    expect(await appController.createPet({}, petDto)).toEqual(createdPet);
  });
  it('should create and return a pet', async () => {
    const petDto = new PetDto('Test Pet', new Date(), 'teste.jpg', 1);
    const createdPet = {
      ...petDto,
      _id: 1,
    } as PetDocument;

    jest
      .spyOn(petsService, 'updatePet')
      .mockImplementation(async () => createdPet);

    expect(await appController.updatePet({}, petDto)).toEqual(createdPet);
  });
  it('should create and return a pet', async () => {
    const petDto = new PetDto('Test Pet', new Date(), 'teste.jpg', 1);
    const createdPet = {
      ...petDto,
      _id: 1,
    } as PetDocument;

    jest
      .spyOn(petsService, 'removeById')
      .mockImplementation(async () => createdPet);

    expect(await appController.removePet(1)).toEqual(createdPet);
  });
});
