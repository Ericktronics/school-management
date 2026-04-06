import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Student } from '../entities/student.entity';
import { Grade } from '../../grades/entities/grade.entity';
import { Class } from '../../classes/entities/class.entity';

export interface IStudentRepository extends IBaseRepository<Student> {
  findByEmail(email: string): Promise<Student | null>;
  findGradesByStudentId(studentId: string): Promise<Grade[]>;
  findClassesByStudentId(studentId: string): Promise<Class[]>;
}
