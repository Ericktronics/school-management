import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from './entities/grade.entity';
import { GradeRepository } from './repositories/grade.repository';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { StudentsModule } from '../students/students.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { ClassesModule } from '../classes/classes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grade]),
    StudentsModule,
    SubjectsModule,
    ClassesModule,
  ],
  controllers: [GradesController],
  providers: [
    {
      provide: 'GRADE_REPOSITORY',
      useClass: GradeRepository,
    },
    GradesService,
  ],
  exports: [GradesService, 'GRADE_REPOSITORY'],
})
export class GradesModule {}
