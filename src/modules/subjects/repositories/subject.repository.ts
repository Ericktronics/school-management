import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { ISubjectRepository } from '../interfaces/subject-repository.interface';

@Injectable()
export class SubjectRepository implements ISubjectRepository {
  constructor(
    @InjectRepository(Subject)
    private readonly repository: Repository<Subject>,
  ) {}

  async findAll(): Promise<Subject[]> {
    return this.repository.find({
      relations: ['teacher'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Subject | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['teacher'],
    });
  }

  async findByCode(code: string): Promise<Subject | null> {
    return this.repository.findOne({ where: { code } });
  }

  async create(data: Partial<Subject>): Promise<Subject> {
    const subject = this.repository.create(data);
    const saved = await this.repository.save(subject);
    return this.repository.findOneOrFail({
      where: { id: saved.id },
      relations: ['teacher'],
    });
  }

  async update(id: string, data: Partial<Subject>): Promise<Subject> {
    await this.repository.update(id, data);
    return this.repository.findOneOrFail({
      where: { id },
      relations: ['teacher'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
