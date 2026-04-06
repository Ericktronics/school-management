import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentRepository } from './repositories/student.repository';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [
    {
      provide: 'STUDENT_REPOSITORY',
      useClass: StudentRepository,
    },
    StudentsService,
  ],
  exports: [StudentsService, 'STUDENT_REPOSITORY'],
})
export class StudentsModule {}
