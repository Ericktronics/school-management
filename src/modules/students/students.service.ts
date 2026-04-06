import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IStudentRepository } from './interfaces/student-repository.interface';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Grade } from '../grades/entities/grade.entity';
import { Class } from '../classes/entities/class.entity';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';

@Injectable()
export class StudentsService {
  constructor(
    @Inject('STUDENT_REPOSITORY')
    private readonly studentRepository: IStudentRepository,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.findAll();
  }

  async findById(id: string): Promise<Student> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new EntityNotFoundException('Student', id);
    }
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    const existing = await this.studentRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`Student with email "${dto.email}" already exists`);
    }
    const data: Partial<Student> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      enrollmentDate: dto.enrollmentDate ? new Date(dto.enrollmentDate) : undefined,
    };
    return this.studentRepository.create(data);
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    await this.findById(id);

    if (dto.email) {
      const existing = await this.studentRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Student with email "${dto.email}" already exists`);
      }
    }

    const data: Partial<Student> = {};
    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.dateOfBirth !== undefined) data.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.enrollmentDate !== undefined) data.enrollmentDate = new Date(dto.enrollmentDate);

    return this.studentRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.studentRepository.delete(id);
  }

  async findGradesByStudentId(studentId: string): Promise<Grade[]> {
    await this.findById(studentId);
    return this.studentRepository.findGradesByStudentId(studentId);
  }

  async findClassesByStudentId(studentId: string): Promise<Class[]> {
    await this.findById(studentId);
    return this.studentRepository.findClassesByStudentId(studentId);
  }
}
