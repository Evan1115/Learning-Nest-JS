import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { isUUID, IsUUID } from 'class-validator';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorators';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks(@Query() getTaskFilterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.taskService.getTasks(getTaskFilterDto);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto,user);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    if (!isUUID(id))
      throw new Error(`Invalid id, UUID format expected but received ${id}`);
    return this.taskService.deleteTask(id);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatus: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatus;
    return this.taskService.updateTaskStatus(id, status);
  }

  // @Delete(':id')
  // deletetask(@Param('id') id: string): void {
  //   this.taskService.deleteTask(id);
  // }

  // @Patch(':id/status')
  // updateTaskStatus(
  //   @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  //   @Param('id') id: string,
  // ): Task {
  //   const { status } = updateTaskStatusDto;
  //   return this.taskService.updateTaskStatus(id, status);
  // }
}
