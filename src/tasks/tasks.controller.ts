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
  InternalServerErrorException,
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
import { UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from 'src/LoggingInterceptop';
import { Logger } from '@nestjs/common/services';

@Controller('tasks')
@UseGuards(AuthGuard())
@UseInterceptors(LoggingInterceptor)
export class TasksController {
  private logger = new Logger('Task Controller');
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTasks(
    @Query() getTaskFilterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `The user ${
        user.username
      } retrieving all data. FilterDto: ${JSON.stringify(getTaskFilterDto)}`,
    );
    return this.taskService.getTasks(getTaskFilterDto, user);
  }

  @Get(':id')
  getTaskById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    if (!isUUID(id))
      // isUUID is a class validator or use ParseUUIDPipe to validate the uuid
      throw new InternalServerErrorException(
        `Invalid id, UUID format expected but received ${id}`,
      );
    return this.taskService.deleteTask(id, user);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatus: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatus;
    return this.taskService.updateTaskStatus(id, status, user);
  }

  //ParseUUIDPipe (pipe)
  //The ParseUUIDPipe in Nest.js is a built-in pipe that can be used to parse a string parameter in a route to a JavaScript UUID object.
  // will throw error if the string parameter cannot be parsed to a valid UUID object
  // can use the @Optional() decorator to make the parameter optional if needed.

  //Pipes
  //in Nest.js are used to transform the values of request parameters before they are passed to a route handler.
  // They can be used to perform tasks such as data validation, conversion, or transformation.

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
