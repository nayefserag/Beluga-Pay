import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  limit: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  page: number = 1;

//   @ApiProperty({ required: false })
//   @IsOptional()
//   order!: 'asc' | 'desc';
}
