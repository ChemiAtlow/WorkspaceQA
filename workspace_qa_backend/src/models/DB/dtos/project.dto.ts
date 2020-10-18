import { IsString } from 'class-validator';

export class ProjectDto {
    @IsString()
    public name!: string;
}
