import { IsString } from 'class-validator';

export class ResponseDto {
    @IsString()
    public message!: string;
}
