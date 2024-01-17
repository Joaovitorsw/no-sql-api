import { IsString } from 'class-validator';

export class CalendarDTO {
  @IsString()
  field: string;
  @IsString()
  month: string;
  @IsString()
  year: string;
}
export class Calendar {
  day: string;
  total: number;
}
