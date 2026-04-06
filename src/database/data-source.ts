import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Teacher } from '../modules/teachers/entities/teacher.entity';
import { Subject } from '../modules/subjects/entities/subject.entity';
import { Student } from '../modules/students/entities/student.entity';
import { Class } from '../modules/classes/entities/class.entity';
import { Grade } from '../modules/grades/entities/grade.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'root',
  database: process.env.DB_DATABASE ?? 'school_management',
  entities: [Teacher, Subject, Student, Class, Grade],
  synchronize: true,
  charset: 'utf8mb4',
});
