import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { SubjectRepository } from './repositories/subject.repository';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subject]), TeachersModule],
  controllers: [SubjectsController],
  providers: [
    {
      provide: 'SUBJECT_REPOSITORY',
      useClass: SubjectRepository,
    },
    SubjectsService,
  ],
  exports: [SubjectsService, 'SUBJECT_REPOSITORY'],
})
export class SubjectsModule {}
