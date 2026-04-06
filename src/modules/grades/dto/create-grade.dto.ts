import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Semester } from '../entities/grade.entity';

export class CreateGradeDto {
  @ApiProperty({ example: 85.5, description: 'Numeric score (0-100)' })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  score: number;

  @ApiProperty({ enum: Semester, example: Semester.FIRST, description: 'Semester (FIRST or SECOND)' })
  @IsNotEmpty()
  @IsEnum(Semester)
  semester: Semester;

  @ApiProperty({ example: '2023-2024', description: 'Academic year' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  academicYear: string;

  @ApiProperty({ example: 'uuid-of-student', description: 'Student ID (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @ApiProperty({ example: 'uuid-of-subject', description: 'Subject ID (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @ApiProperty({ example: 'uuid-of-class', description: 'Class ID (UUID)' })
  @IsNotEmpty()
  @IsUUID()
  classId: string;

  @ApiPropertyOptional({ example: 'Excellent performance', description: 'Optional remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
