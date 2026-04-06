import {
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ISubjectRepository } from './interfaces/subject-repository.interface';
import { Subject } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';
import { TeachersService } from '../teachers/teachers.service';

@Injectable()
export class SubjectsService {
  constructor(
    @Inject('SUBJECT_REPOSITORY')
    private readonly subjectRepository: ISubjectRepository,
    private readonly teachersService: TeachersService,
  ) {}

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.findAll();
  }

  async findById(id: string): Promise<Subject> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new EntityNotFoundException('Subject', id);
    }
    return subject;
  }

  async create(dto: CreateSubjectDto): Promise<Subject> {
    const existing = await this.subjectRepository.findByCode(dto.code);
    if (existing) {
      throw new ConflictException(`Subject with code "${dto.code}" already exists`);
    }

    if (dto.teacherId) {
      await this.teachersService.findById(dto.teacherId);
    }

    return this.subjectRepository.create(dto);
  }

  async update(id: string, dto: UpdateSubjectDto): Promise<Subject> {
    await this.findById(id);

    if (dto.code) {
      const existing = await this.subjectRepository.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Subject with code "${dto.code}" already exists`);
      }
    }

    if (dto.teacherId) {
      await this.teachersService.findById(dto.teacherId);
    }

    return this.subjectRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.subjectRepository.delete(id);
  }
}
