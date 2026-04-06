import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Teacher } from '../entities/teacher.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Class } from '../../classes/entities/class.entity';

export interface ITeacherRepository extends IBaseRepository<Teacher> {
  findByEmail(email: string): Promise<Teacher | null>;
  findSubjectsByTeacherId(teacherId: string): Promise<Subject[]>;
  findClassesByTeacherId(teacherId: string): Promise<Class[]>;
}
