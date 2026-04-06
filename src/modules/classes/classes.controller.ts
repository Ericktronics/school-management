import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class EnrollStudentDto {
  @ApiProperty({ example: 'uuid-of-student', description: 'Student ID to enroll' })
  @IsUUID()
  studentId: string;
}

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'List of all classes', type: [Class] })
  findAll(): Promise<Class[]> {
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a class by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Class found', type: Class })
  @ApiResponse({ status: 404, description: 'Class not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Class> {
    return this.classesService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created', type: Class })
  create(@Body() dto: CreateClassDto): Promise<Class> {
    return this.classesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a class' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Class updated', type: Class })
  @ApiResponse({ status: 404, description: 'Class not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClassDto,
  ): Promise<Class> {
    return this.classesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a class' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Class deleted' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.classesService.delete(id);
  }

  @Get(':id/students')
  @ApiOperation({ summary: 'Get all students in a class' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of students in class' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  findStudents(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findStudentsByClassId(id);
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll a student in a class' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: EnrollStudentDto })
  @ApiResponse({ status: 200, description: 'Student enrolled' })
  @ApiResponse({ status: 404, description: 'Class or student not found' })
  @ApiResponse({ status: 409, description: 'Student already enrolled' })
  enrollStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: EnrollStudentDto,
  ) {
    return this.classesService.enrollStudent(id, body.studentId);
  }

  @Delete(':id/unenroll/:studentId')
  @ApiOperation({ summary: 'Unenroll a student from a class' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiParam({ name: 'studentId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Student unenrolled' })
  @ApiResponse({ status: 404, description: 'Class or student not found' })
  unenrollStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.classesService.unenrollStudent(id, studentId);
  }
}
