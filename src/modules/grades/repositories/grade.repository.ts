import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from '../entities/grade.entity';
import { IGradeRepository, StudentGradeReport } from '../interfaces/grade-repository.interface';

@Injectable()
export class GradeRepository implements IGradeRepository {
  constructor(
    @InjectRepository(Grade)
    private readonly repository: Repository<Grade>,
  ) {}

  async findAll(): Promise<Grade[]> {
    return this.repository.find({
      relations: ['student', 'subject', 'class'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Grade | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['student', 'subject', 'class'],
    });
  }

  async create(data: Partial<Grade>): Promise<Grade> {
    const grade = this.repository.create(data);
    const saved = await this.repository.save(grade);
    return this.repository.findOneOrFail({
      where: { id: saved.id },
      relations: ['student', 'subject', 'class'],
    });
  }

  async update(id: string, data: Partial<Grade>): Promise<Grade> {
    const existing = await this.repository.findOneOrFail({ where: { id } });
    const merged = this.repository.merge(existing, data);
    merged.computeLetterGrade();
    await this.repository.save(merged);
    return this.repository.findOneOrFail({
      where: { id },
      relations: ['student', 'subject', 'class'],
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findGradeReportByStudentId(studentId: string): Promise<StudentGradeReport[]> {
    const grades = await this.repository.find({
      where: { studentId },
      relations: ['subject', 'class'],
      order: { createdAt: 'ASC' },
    });

    const subjectMap = new Map<string, StudentGradeReport>();

    for (const grade of grades) {
      const subjectId = grade.subjectId;

      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, {
          subjectId,
          subjectName: grade.subject?.name ?? '',
          subjectCode: grade.subject?.code ?? '',
          grades: [],
          average: 0,
        });
      }

      subjectMap.get(subjectId)!.grades.push(grade);
    }

    for (const report of subjectMap.values()) {
      const total = report.grades.reduce((sum, g) => sum + Number(g.score), 0);
      report.average = report.grades.length > 0
        ? Math.round((total / report.grades.length) * 100) / 100
        : 0;
    }

    return Array.from(subjectMap.values());
  }
}
