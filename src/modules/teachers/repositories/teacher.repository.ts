import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { ITeacherRepository } from '../interfaces/teacher-repository.interface';
import { Subject } from '../../subjects/entities/subject.entity';
import { Class } from '../../classes/entities/class.entity';

@Injectable()
export class TeacherRepository implements ITeacherRepository {
  constructor(
    @InjectRepository(Teacher)
    private readonly repository: Repository<Teacher>,
  ) {}

  async findAll(): Promise<Teacher[]> {
    return this.repository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findById(id: string): Promise<Teacher | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(data: Partial<Teacher>): Promise<Teacher> {
    const teacher = this.repository.create(data);
    return this.repository.save(teacher);
  }

  async update(id: string, data: Partial<Teacher>): Promise<Teacher> {
    await this.repository.update(id, data);
    return this.repository.findOneOrFail({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findSubjectsByTeacherId(teacherId: string): Promise<Subject[]> {
    const teacher = await this.repository.findOne({
      where: { id: teacherId },
      relations: ['subjects'],
    });
    return teacher?.subjects ?? [];
  }

  async findClassesByTeacherId(teacherId: string): Promise<Class[]> {
    const teacher = await this.repository.findOne({
      where: { id: teacherId },
      relations: ['classes'],
    });
    return teacher?.classes ?? [];
  }
}
