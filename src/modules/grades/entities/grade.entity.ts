import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Class } from '../../classes/entities/class.entity';

export enum Semester {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
}

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ name: 'letter_grade', length: 2, nullable: true })
  letterGrade: string;

  @Column({ type: 'enum', enum: Semester })
  semester: Semester;

  @Column({ name: 'academic_year', length: 20 })
  academicYear: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'subject_id' })
  subjectId: string;

  @Column({ name: 'class_id' })
  classId: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ManyToOne(() => Student, (student) => student.grades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Subject, (subject) => subject.grades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @ManyToOne(() => Class, (cls) => cls.grades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  computeLetterGrade(): void {
    const s = Number(this.score);
    if (s >= 90) {
      this.letterGrade = 'A';
    } else if (s >= 80) {
      this.letterGrade = 'B';
    } else if (s >= 70) {
      this.letterGrade = 'C';
    } else if (s >= 60) {
      this.letterGrade = 'D';
    } else {
      this.letterGrade = 'F';
    }
  }
}
