import { AppDataSource } from './data-source';
import { Teacher } from '../modules/teachers/entities/teacher.entity';
import { Subject } from '../modules/subjects/entities/subject.entity';
import { Student } from '../modules/students/entities/student.entity';
import { Class } from '../modules/classes/entities/class.entity';
import { Grade, Semester } from '../modules/grades/entities/grade.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database. Running seed...');

  // Clear existing data (order matters for FK constraints)
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 0');
  await AppDataSource.query('TRUNCATE TABLE grades');
  await AppDataSource.query('TRUNCATE TABLE class_students');
  await AppDataSource.query('TRUNCATE TABLE classes');
  await AppDataSource.query('TRUNCATE TABLE subjects');
  await AppDataSource.query('TRUNCATE TABLE students');
  await AppDataSource.query('TRUNCATE TABLE teachers');
  await AppDataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  console.log('Cleared existing data.');

  // --- Teachers ---
  const teacherRepo = AppDataSource.getRepository(Teacher);
  const [alice, bob, carol] = await teacherRepo.save([
    {
      firstName: 'Alice',
      lastName: 'Santos',
      email: 'alice.santos@school.edu',
      phone: '09171234001',
      specialization: 'Mathematics',
    },
    {
      firstName: 'Bob',
      lastName: 'Reyes',
      email: 'bob.reyes@school.edu',
      phone: '09171234002',
      specialization: 'Science',
    },
    {
      firstName: 'Carol',
      lastName: 'Lim',
      email: 'carol.lim@school.edu',
      phone: '09171234003',
      specialization: 'English',
    },
  ]);
  console.log('Seeded teachers.');

  // --- Subjects ---
  const subjectRepo = AppDataSource.getRepository(Subject);
  const [math, science, english, history] = await subjectRepo.save([
    {
      name: 'Mathematics',
      code: 'MATH101',
      description: 'Fundamentals of algebra and geometry.',
      teacherId: alice.id,
    },
    {
      name: 'Science',
      code: 'SCI101',
      description: 'Introduction to physics, chemistry, and biology.',
      teacherId: bob.id,
    },
    {
      name: 'English',
      code: 'ENG101',
      description: 'Reading comprehension and composition.',
      teacherId: carol.id,
    },
    {
      name: 'History',
      code: 'HIS101',
      description: 'Philippine and world history.',
      teacherId: null,
    },
  ]);
  console.log('Seeded subjects.');

  // --- Students ---
  const studentRepo = AppDataSource.getRepository(Student);
  const students = await studentRepo.save([
    {
      firstName: 'Juan',
      lastName: 'dela Cruz',
      email: 'juan.delacruz@student.edu',
      dateOfBirth: new Date('2010-03-15'),
      enrollmentDate: new Date('2024-06-01'),
    },
    {
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@student.edu',
      dateOfBirth: new Date('2010-07-22'),
      enrollmentDate: new Date('2024-06-01'),
    },
    {
      firstName: 'Pedro',
      lastName: 'Ramos',
      email: 'pedro.ramos@student.edu',
      dateOfBirth: new Date('2011-01-10'),
      enrollmentDate: new Date('2024-06-01'),
    },
    {
      firstName: 'Ana',
      lastName: 'Torres',
      email: 'ana.torres@student.edu',
      dateOfBirth: new Date('2011-05-30'),
      enrollmentDate: new Date('2024-06-01'),
    },
    {
      firstName: 'Luis',
      lastName: 'Mendoza',
      email: 'luis.mendoza@student.edu',
      dateOfBirth: new Date('2010-11-18'),
      enrollmentDate: new Date('2024-06-01'),
    },
    {
      firstName: 'Sofia',
      lastName: 'Cruz',
      email: 'sofia.cruz@student.edu',
      dateOfBirth: new Date('2011-08-04'),
      enrollmentDate: new Date('2024-06-01'),
    },
  ]);
  const [juan, maria, pedro, ana, luis, sofia] = students;
  console.log('Seeded students.');

  // --- Classes ---
  const classRepo = AppDataSource.getRepository(Class);
  const [classA, classB] = await classRepo.save([
    {
      name: 'Grade 7 - Section A',
      gradeLevel: 'Grade 7',
      academicYear: '2024-2025',
      homeroomTeacherId: alice.id,
      students: [juan, maria, pedro],
    },
    {
      name: 'Grade 7 - Section B',
      gradeLevel: 'Grade 7',
      academicYear: '2024-2025',
      homeroomTeacherId: bob.id,
      students: [ana, luis, sofia],
    },
  ]);
  console.log('Seeded classes.');

  // --- Grades ---
  const gradeRepo = AppDataSource.getRepository(Grade);
  const gradeData = [
    // Section A - First Semester
    { student: juan,  subject: math,    cls: classA, score: 92, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: juan,  subject: science, cls: classA, score: 88, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: juan,  subject: english, cls: classA, score: 85, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: maria, subject: math,    cls: classA, score: 95, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: maria, subject: science, cls: classA, score: 91, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: maria, subject: english, cls: classA, score: 97, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: pedro, subject: math,    cls: classA, score: 74, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: pedro, subject: science, cls: classA, score: 78, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: pedro, subject: english, cls: classA, score: 82, semester: Semester.FIRST,  academicYear: '2024-2025' },
    // Section A - Second Semester
    { student: juan,  subject: math,    cls: classA, score: 90, semester: Semester.SECOND, academicYear: '2024-2025' },
    { student: maria, subject: math,    cls: classA, score: 98, semester: Semester.SECOND, academicYear: '2024-2025' },
    { student: pedro, subject: math,    cls: classA, score: 70, semester: Semester.SECOND, academicYear: '2024-2025' },
    // Section B - First Semester
    { student: ana,   subject: math,    cls: classB, score: 88, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: ana,   subject: science, cls: classB, score: 93, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: ana,   subject: history, cls: classB, score: 86, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: luis,  subject: math,    cls: classB, score: 65, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: luis,  subject: science, cls: classB, score: 72, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: luis,  subject: history, cls: classB, score: 68, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: sofia, subject: math,    cls: classB, score: 80, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: sofia, subject: science, cls: classB, score: 84, semester: Semester.FIRST,  academicYear: '2024-2025' },
    { student: sofia, subject: history, cls: classB, score: 79, semester: Semester.FIRST,  academicYear: '2024-2025' },
  ];

  await gradeRepo.save(
    gradeData.map(({ student, subject, cls, score, semester, academicYear }) => ({
      studentId: student.id,
      subjectId: subject.id,
      classId: cls.id,
      score,
      semester,
      academicYear,
    })),
  );
  console.log('Seeded grades.');

  await AppDataSource.destroy();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
