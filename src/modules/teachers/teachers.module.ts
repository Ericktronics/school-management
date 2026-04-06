import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { TeacherRepository } from './repositories/teacher.repository';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher])],
  controllers: [TeachersController],
  providers: [
    {
      provide: 'TEACHER_REPOSITORY',
      useClass: TeacherRepository,
    },
    TeachersService,
  ],
  exports: [TeachersService, 'TEACHER_REPOSITORY'],
})
export class TeachersModule {}
