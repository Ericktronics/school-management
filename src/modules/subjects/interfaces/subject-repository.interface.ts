import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';
import { Subject } from '../entities/subject.entity';

export interface ISubjectRepository extends IBaseRepository<Subject> {
  findByCode(code: string): Promise<Subject | null>;
}
