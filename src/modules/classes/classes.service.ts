import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IClassRepository } from './interfaces/class-repository.interface';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Student } from '../students/entities/student.entity';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';
import { TeachersService } from '../teachers/teachers.service';
import { StudentsService } from '../students/students.service';

@Injectable()
export class ClassesService {
  constructor(
    @Inject('CLASS_REPOSITORY')
    private readonly classRepository: IClassRepository,
    private readonly teachersService: TeachersService,
    private readonly studentsService: StudentsService,
  ) {}

  async findAll(): Promise<Class[]> {
    return this.classRepository.findAll();
  }

  async findById(id: string): Promise<Class> {
    const cls = await this.classRepository.findByIdWithRelations(id);
    if (!cls) {
      throw new EntityNotFoundException('Class', id);
    }
    return cls;
  }

  async create(dto: CreateClassDto): Promise<Class> {
    if (dto.homeroomTeacherId) {
      await this.teachersService.findById(dto.homeroomTeacherId);
    }
    return this.classRepository.create(dto);
  }

  async update(id: string, dto: UpdateClassDto): Promise<Class> {
    await this.findById(id);

    if (dto.homeroomTeacherId) {
      await this.teachersService.findById(dto.homeroomTeacherId);
    }

    return this.classRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.classRepository.delete(id);
  }

  async findStudentsByClassId(classId: string): Promise<Student[]> {
    const cls = await this.classRepository.findById(classId);
    if (!cls) {
      throw new EntityNotFoundException('Class', classId);
    }
    return this.classRepository.findStudentsByClassId(classId);
  }

  async enrollStudent(classId: string, studentId: string): Promise<{ message: string }> {
    const cls = await this.classRepository.findById(classId);
    if (!cls) {
      throw new EntityNotFoundException('Class', classId);
    }

    await this.studentsService.findById(studentId);

    const alreadyEnrolled = await this.classRepository.isStudentEnrolled(classId, studentId);
    if (alreadyEnrolled) {
      throw new ConflictException(`Student is already enrolled in this class`);
    }

    await this.classRepository.enrollStudent(classId, studentId);
    return { message: 'Student enrolled successfully' };
  }

  async unenrollStudent(classId: string, studentId: string): Promise<{ message: string }> {
    const cls = await this.classRepository.findById(classId);
    if (!cls) {
      throw new EntityNotFoundException('Class', classId);
    }

    await this.studentsService.findById(studentId);

    const enrolled = await this.classRepository.isStudentEnrolled(classId, studentId);
    if (!enrolled) {
      throw new BadRequestException(`Student is not enrolled in this class`);
    }

    await this.classRepository.unenrollStudent(classId, studentId);
    return { message: 'Student unenrolled successfully' };
  }
}
