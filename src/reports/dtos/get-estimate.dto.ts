import {
  IsNumber,
  IsString,
  Max,
  Min,
  IsLongitude,
  IsLatitude,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetEstimateDto {
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsBoolean()
  approved;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1950)
  @Max(2022)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  mileage: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;
}
