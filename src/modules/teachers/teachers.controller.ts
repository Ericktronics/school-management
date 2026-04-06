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
} from '@nestjs/swagger';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({ status: 200, description: 'List of all teachers', type: [Teacher] })
  findAll(): Promise<Teacher[]> {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Teacher found', type: Teacher })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Teacher> {
    return this.teachersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({ status: 201, description: 'Teacher created', type: Teacher })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() dto: CreateTeacherDto): Promise<Teacher> {
    return this.teachersService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a teacher' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Teacher updated', type: Teacher })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeacherDto,
  ): Promise<Teacher> {
    return this.teachersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Teacher deleted' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.teachersService.delete(id);
  }

  @Get(':id/subjects')
  @ApiOperation({ summary: 'Get all subjects taught by a teacher' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of subjects' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findSubjects(@Param('id', ParseUUIDPipe) id: string) {
    return this.teachersService.findSubjectsByTeacherId(id);
  }

  @Get(':id/classes')
  @ApiOperation({ summary: 'Get all classes of a teacher' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of classes' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findClasses(@Param('id', ParseUUIDPipe) id: string) {
    return this.teachersService.findClassesByTeacherId(id);
  }
}
