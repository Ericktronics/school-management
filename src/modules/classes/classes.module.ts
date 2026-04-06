import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { ClassRepository } from './repositories/class.repository';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TeachersModule } from '../teachers/teachers.module';
import { StudentsModule } from '../students/students.module';

@Module({
  imports: [TypeOrmModule.forFeature([Class]), TeachersModule, StudentsModule],
  controllers: [ClassesController],
  providers: [
    {
      provide: 'CLASS_REPOSITORY',
      useClass: ClassRepository,
    },
    ClassesService,
  ],
  exports: [ClassesService, 'CLASS_REPOSITORY'],
})
export class ClassesModule {}
