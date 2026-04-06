import { Inject, Injectable } from '@nestjs/common';
import { IGradeRepository, StudentGradeReport } from './interfaces/grade-repository.interface';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';
import { StudentsService } from '../students/students.service';
import { SubjectsService } from '../subjects/subjects.service';
import { ClassesService } from '../classes/classes.service';

@Injectable()
export class GradesService {
  constructor(
    @Inject('GRADE_REPOSITORY')
    private readonly gradeRepository: IGradeRepository,
    private readonly studentsService: StudentsService,
    private readonly subjectsService: SubjectsService,
    private readonly classesService: ClassesService,
  ) {}

  async findAll(): Promise<Grade[]> {
    return this.gradeRepository.findAll();
  }

  async findById(id: string): Promise<Grade> {
    const grade = await this.gradeRepository.findById(id);
    if (!grade) {
      throw new EntityNotFoundException('Grade', id);
    }
    return grade;
  }

  async create(dto: CreateGradeDto): Promise<Grade> {
    await this.studentsService.findById(dto.studentId);
    await this.subjectsService.findById(dto.subjectId);
    await this.classesService.findById(dto.classId);
    return this.gradeRepository.create(dto);
  }

  async update(id: string, dto: UpdateGradeDto): Promise<Grade> {
    await this.findById(id);

    if (dto.studentId) {
      await this.studentsService.findById(dto.studentId);
    }
    if (dto.subjectId) {
      await this.subjectsService.findById(dto.subjectId);
    }
    if (dto.classId) {
      await this.classesService.findById(dto.classId);
    }

    return this.gradeRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.gradeRepository.delete(id);
  }

  async getStudentGradeReport(studentId: string): Promise<StudentGradeReport[]> {
    await this.studentsService.findById(studentId);
    return this.gradeRepository.findGradeReportByStudentId(studentId);
  }
}
