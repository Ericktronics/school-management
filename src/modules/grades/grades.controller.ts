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
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@ApiTags('Grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all grades' })
  @ApiResponse({ status: 200, description: 'List of all grades', type: [Grade] })
  findAll(): Promise<Grade[]> {
    return this.gradesService.findAll();
  }

  @Get('report/student/:studentId')
  @ApiOperation({ summary: 'Get grade report for a student grouped by subject' })
  @ApiParam({ name: 'studentId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Student grade report' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  getStudentReport(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.gradesService.getStudentGradeReport(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a grade by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Grade found', type: Grade })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Grade> {
    return this.gradesService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new grade' })
  @ApiResponse({ status: 201, description: 'Grade created', type: Grade })
  @ApiResponse({ status: 404, description: 'Student, subject, or class not found' })
  create(@Body() dto: CreateGradeDto): Promise<Grade> {
    return this.gradesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a grade' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Grade updated', type: Grade })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGradeDto,
  ): Promise<Grade> {
    return this.gradesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a grade' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Grade deleted' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.gradesService.delete(id);
  }
}
