import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ example: 'Grade 10 - Section A', description: 'Class name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '10', description: 'Grade level' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  gradeLevel: string;

  @ApiProperty({ example: '2023-2024', description: 'Academic year' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  academicYear: string;

  @ApiPropertyOptional({ example: 'uuid-of-teacher', description: 'Homeroom teacher ID (UUID)' })
  @IsOptional()
  @IsUUID()
  homeroomTeacherId?: string;
}
