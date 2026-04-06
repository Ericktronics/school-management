import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Grade } from '../entities/grade.entity';

export interface StudentGradeReport {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  grades: Grade[];
  average: number;
}

export interface IGradeRepository extends IBaseRepository<Grade> {
  findAllWithRelations(): Promise<Grade[]>;
  findByIdWithRelations(id: string): Promise<Grade | null>;
  findGradeReportByStudentId(studentId: string): Promise<StudentGradeReport[]>;
}
