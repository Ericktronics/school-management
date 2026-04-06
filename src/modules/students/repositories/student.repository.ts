import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { IStudentRepository } from '../interfaces/student-repository.interface';
import { Grade } from '../../grades/entities/grade.entity';
import { Class } from '../../classes/entities/class.entity';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(
    @InjectRepository(Student)
    private readonly repository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.repository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findById(id: string): Promise<Student | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(data: Partial<Student>): Promise<Student> {
    const student = this.repository.create(data);
    return this.repository.save(student);
  }

  async update(id: string, data: Partial<Student>): Promise<Student> {
    await this.repository.update(id, data);
    return this.repository.findOneOrFail({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findGradesByStudentId(studentId: string): Promise<Grade[]> {
    const student = await this.repository.findOne({
      where: { id: studentId },
      relations: ['grades', 'grades.subject', 'grades.class'],
    });
    return student?.grades ?? [];
  }

  async findClassesByStudentId(studentId: string): Promise<Class[]> {
    const student = await this.repository.findOne({
      where: { id: studentId },
      relations: ['classes', 'classes.homeroomTeacher'],
    });
    return student?.classes ?? [];
  }
}
