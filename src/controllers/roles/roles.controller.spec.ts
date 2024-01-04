import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesRepository } from '../../repository/roles/roles.repository';
import { RoleDocument, Roles } from '../../schemas/roles.schema';
import { ErrorDomainService } from '../../services/error-domain/error-domain.service';
import { RolesService } from '../../services/roles/roles.service';
import { RolesController } from './roles.controller';

describe('RolesController', () => {
  let appController: RolesController;
  let rolesService: RolesService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        RolesRepository,
        RolesService,
        ErrorDomainService,
        { provide: getModelToken(Roles.name), useValue: jest.fn() },
      ],
    }).compile();
    rolesService = app.get<RolesService>(RolesService);
    appController = app.get<RolesController>(RolesController);
  });

  it('should return an array of cats', async () => {
    const result = [
      {
        _id: 1,
        name: 'Osvaldo',
      },
    ] as RoleDocument[];
    const response = {
      items: result,
      total: result.length,
      page: 1,
      size: 10,
    };
    jest
      .spyOn(rolesService, 'findAll')
      .mockImplementation(() => Promise.resolve(response));

    expect(await appController.findAll()).toBe(response);
  });
  it('should return by id of cats', async () => {
    const result = {
      _id: 1,
      name: 'Osvaldo',
    } as RoleDocument;

    jest
      .spyOn(rolesService, 'findById')
      .mockImplementation(() => Promise.resolve(result));

    expect(await appController.find(1)).toBe(result);
  });

  it('should create and return a cat', async () => {
    const roleDto = new Roles();
    const createdRole = {
      ...roleDto,
      _id: 1,
    } as RoleDocument;
    jest
      .spyOn(rolesService, 'create')
      .mockImplementation(async () => createdRole);

    expect(await appController.create(roleDto)).toEqual(createdRole);
  });
  it('should create and return a cat', async () => {
    const roleDto = new Roles();
    const createdRole = {
      ...roleDto,
      _id: 1,
    } as RoleDocument;

    jest
      .spyOn(rolesService, 'update')
      .mockImplementation(async () => createdRole);

    expect(await appController.update(roleDto)).toEqual(createdRole);
  });
  it('should create and return a cat', async () => {
    const roleDto = new Roles();
    const createdRole = {
      ...roleDto,
      _id: 1,
    } as RoleDocument;

    jest
      .spyOn(rolesService, 'removeById')
      .mockImplementation(async () => createdRole);

    expect(await appController.remove(1)).toEqual(createdRole);
  });
});
