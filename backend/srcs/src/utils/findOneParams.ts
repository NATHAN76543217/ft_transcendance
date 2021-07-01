import { IsNumber, IsNumberString } from 'class-validator';

export class   FindOneParam {
    @IsNumberString()
    // @IsNumber()
    id: string;
}