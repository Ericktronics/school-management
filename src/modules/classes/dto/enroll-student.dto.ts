import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class EnrollStudentDto {
  @ApiProperty({ example: 'uuid-of-student', description: 'Student ID to enroll' })
  @IsUUID()
  studentId: string;
}
