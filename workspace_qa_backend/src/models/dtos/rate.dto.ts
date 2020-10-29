import { IsEnum } from 'class-validator';
import { Rating } from '../interfaces';

export class RateDto {
    @IsEnum(Rating)
    public rating!: Rating;
}
