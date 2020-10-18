import { IsString, IsIn } from 'class-validator';

export class QuestionDto {
    @IsString()
    public title!: string;
    @IsString()
    public filePath!: string;
    @IsIn(['Initial', 'Answered', 'Accepted', 'Closed'])
    public state!: 'Initial' | 'Answered' | 'Accepted' | 'Closed';
}
