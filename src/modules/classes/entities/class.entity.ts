import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Student } from '../../students/entities/student.entity';
import { Grade } from '../../grades/entities/grade.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'grade_level', length: 50 })
  gradeLevel: string;

  @Column({ name: 'academic_year', length: 20 })
  academicYear: string;

  @Column({ name: 'homeroom_teacher_id', nullable: true })
  homeroomTeacherId: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.classes, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'homeroom_teacher_id' })
  homeroomTeacher: Teacher;

  @ManyToMany(() => Student, (student) => student.classes)
  @JoinTable({
    name: 'class_students',
    joinColumn: { name: 'class_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'student_id', referencedColumnName: 'id' },
  })
  students: Student[];

  @OneToMany(() => Grade, (grade) => grade.class, { cascade: false })
  grades: Grade[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
