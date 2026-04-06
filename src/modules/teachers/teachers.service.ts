import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ITeacherRepository } from './interfaces/teacher-repository.interface';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Subject } from '../subjects/entities/subject.entity';
import { Class } from '../classes/entities/class.entity';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';

@Injectable()
export class TeachersService {
  constructor(
    @Inject('TEACHER_REPOSITORY')
    private readonly teacherRepository: ITeacherRepository,
  ) {}

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.findAll();
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) {
      throw new EntityNotFoundException('Teacher', id);
    }
    return teacher;
  }

  async create(dto: CreateTeacherDto): Promise<Teacher> {
    const existing = await this.teacherRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(`Teacher with email "${dto.email}" already exists`);
    }
    return this.teacherRepository.create(dto);
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
    await this.findById(id);

    if (dto.email) {
      const existing = await this.teacherRepository.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Teacher with email "${dto.email}" already exists`);
      }
    }

    return this.teacherRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.teacherRepository.delete(id);
  }

  async findSubjectsByTeacherId(teacherId: string): Promise<Subject[]> {
    await this.findById(teacherId);
    return this.teacherRepository.findSubjectsByTeacherId(teacherId);
  }

  async findClassesByTeacherId(teacherId: string): Promise<Class[]> {
    await this.findById(teacherId);
    return this.teacherRepository.findClassesByTeacherId(teacherId);
  }
}
