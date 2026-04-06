import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Class } from '../entities/class.entity';
import { Student } from '../../students/entities/student.entity';

export interface IClassRepository extends IBaseRepository<Class> {
  findByIdWithRelations(id: string): Promise<Class | null>;
  findStudentsByClassId(classId: string): Promise<Student[]>;
  enrollStudent(classId: string, studentId: string): Promise<void>;
  unenrollStudent(classId: string, studentId: string): Promise<void>;
  isStudentEnrolled(classId: string, studentId: string): Promise<boolean>;
}
