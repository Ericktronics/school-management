import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../entities/class.entity';
import { IClassRepository } from '../interfaces/class-repository.interface';
import { Student } from '../../students/entities/student.entity';

@Injectable()
export class ClassRepository implements IClassRepository {
  constructor(
    @InjectRepository(Class)
    private readonly repository: Repository<Class>,
  ) {}

  async findAll(): Promise<Class[]> {
    return this.repository.find({
      relations: ['homeroomTeacher'],
      order: { name: 'ASC' },
    });
  }

  async findAllWithRelations(): Promise<Class[]> {
    return this.repository.find({
      relations: ['homeroomTeacher', 'students'],
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<Class | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['homeroomTeacher'],
    });
  }

  async findByIdWithRelations(id: string): Promise<Class | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['homeroomTeacher', 'students'],
    });
  }

  async create(data: Partial<Class>): Promise<Class> {
    const cls = this.repository.create(data);
    const saved = await this.repository.save(cls);
    return this.repository.findOneOrFail({
      where: { id: saved.id },
      relations: ['homeroomTeacher'],
    });
  }

  async update(id: string, data: Partial<Class>): Promise<Class> {
    await this.repository.update(id, data);
    return this.repository.findOneOrFail({
      where: { id },
      relations: ['homeroomTeacher'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findStudentsByClassId(classId: string): Promise<Student[]> {
    const cls = await this.repository.findOne({
      where: { id: classId },
      relations: ['students'],
    });
    return cls?.students ?? [];
  }

  async enrollStudent(classId: string, studentId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .relation(Class, 'students')
      .of(classId)
      .add(studentId);
  }

  async unenrollStudent(classId: string, studentId: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .relation(Class, 'students')
      .of(classId)
      .remove(studentId);
  }

  async isStudentEnrolled(classId: string, studentId: string): Promise<boolean> {
    const count = await this.repository
      .createQueryBuilder('class')
      .innerJoin('class.students', 'student', 'student.id = :studentId', { studentId })
      .where('class.id = :classId', { classId })
      .getCount();
    return count > 0;
  }
}
