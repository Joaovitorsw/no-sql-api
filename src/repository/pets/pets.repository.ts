import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { CalendarDTO } from 'src/dtos/calendar';
import {
  PaginationRequest,
  PaginationResponse,
} from 'src/models/pagination-response';
import { PetDto } from '../../dtos/pet.dto';
import { Pet, PetDocument } from '../../schemas/pets.schema';
import { BaseRepository } from '../base/base.repository';

const POPULATION_OBJECT = {
  path: 'owner',
  select: '-password',
  populate: {
    path: 'role',
  },
};
@Injectable()
export class PetsRepository extends BaseRepository<Pet> {
  constructor(@InjectModel(Pet.name) public petModel: Model<Pet>) {
    super(petModel, POPULATION_OBJECT);
  }

  async create(petDto: PetDto): Promise<PetDocument> {
    const pet = await super.create(petDto, POPULATION_OBJECT);
    return pet;
  }

  async findOneAndUpdate(petDto: PetDto): Promise<PetDocument> {
    const pets = await super.findOneAndUpdate(
      {
        _id: +petDto['id'],
      },
      {
        ...petDto,
      },
      {
        new: true,
      },
      POPULATION_OBJECT,
    );
    return pets;
  }
  async findOneAndDelete(predicate: FilterQuery<Pet>): Promise<PetDocument> {
    const pets = await super.findOneAndDelete(predicate, {}, POPULATION_OBJECT);
    return pets;
  }

  async searchByField(entity?: PaginationRequest<Partial<PetDto>>) {
    const page = +(entity?.page ?? 0),
      size = +(entity?.size ?? 30);
    const [field, order] = (entity?.sort ?? 'id,asc').split(',');
    const sort: any = {
      $sort: {
        [field]: order == 'asc' ? 1 : -1,
      },
    };

    const queryCriteria = this.getQueryCriteria(entity);
    delete queryCriteria['page'];
    delete queryCriteria['size'];
    delete queryCriteria['sort'];
    const aggregateCriteria: PipelineStage[] = [];
    aggregateCriteria.push(
      {
        $addFields: {
          _id: { $toString: '$_id' },
          owner: { $toString: '$owner' },
          ownerID: { $toInt: '$owner' },
          id: { $toInt: '$_id' },
        },
      },
      {
        $match: {
          ...queryCriteria,
        },
      },
      sort,
      {
        $skip: page * size,
      },
      {
        $limit: size,
      },
    );
    const matchCount = await this.petModel.aggregate([
      aggregateCriteria[0],
      {
        $match: {
          ...queryCriteria,
        },
      },
      {
        $count: 'total',
      },
    ]);
    const total = matchCount[0]?.total ?? 0;

    aggregateCriteria.push(
      {
        $lookup: {
          from: 'users',
          localField: 'ownerID',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: {
          path: '$owner',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'owner.role',
          foreignField: '_id',
          as: 'owner.role',
        },
      },
      {
        $unwind: {
          path: '$owner.role',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$owner.role.id',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'owner.id': '$owner._id',
          'owner.role.id': '$owner.role._id',
        },
      },
      {
        $unset: [
          'owner.password',
          'owner._id',
          '_id',
          'ownerID',
          'owner.role._id',
        ],
      },
    );
    return {
      items: await this.petModel.aggregate(aggregateCriteria),
      page: page,
      size: size,
      total: total,
    } as PaginationResponse<PetDocument>;
  }

  async searchByDate(calendar: CalendarDTO) {
    const lastDay = (year, month) => new Date(+year, +month, 0).getDate();
    return await this.petModel.aggregate([
      {
        $match: {
          [calendar.field]: {
            $gte: new Date(
              `${calendar.year}-${calendar.month.padStart(
                2,
                '0',
              )}-01T00:00:00-03:00`,
            ),
            $lte: new Date(
              `${calendar.year}-${calendar.month.padStart(2, '0')}-${lastDay(
                calendar.year,
                calendar.month,
              )}T23:59:59-03:00`,
            ),
          },
        },
      },
      {
        $project: {
          day: {
            $dateToString: { format: '%Y-%m-%d', date: `$${calendar.field}` },
          },
        },
      },
      {
        $group: {
          _id: '$day',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          day: '$_id',
          total: '$count',
        },
      },
    ]);
  }

  async findById(id: string | number | Types.ObjectId): Promise<PetDocument> {
    const pet = await super.findById(id, POPULATION_OBJECT);
    return pet;
  }
}
