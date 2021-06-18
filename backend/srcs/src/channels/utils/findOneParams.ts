import { IsNumberString } from 'class-validator';

export class FindOneParan {
    @IsNumberString()
    id: string;
}