import { IsString } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    public title!: string;
    @IsString()
    public filePath!: string;
    @IsString()
    public message!: string;
}
