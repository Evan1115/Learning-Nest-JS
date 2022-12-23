import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
// import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './tasks.repository';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { filter } from 'rxjs';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TaskRepository) {}
  // getTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTask(id: string): Task {
  //   const found = this.tasks.find((task) => task.id == id)
  //   if(!found) throw new NotFoundException(`Task with id "${id}" not found`)
  //   return found
  // }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id,
        user, //since we have user property defined in task enitity, we can find with that property
      },
    });

    //alternative way to check if task is belong to user!!
    // if (!user.tasks.find((item) => item.id === id)) {
    //   throw new UnauthorizedException(
    //     `You are not authorized for Task with id ${id}`,
    //   );
    // }
    if (!found) throw new NotFoundException(`Task with id "${id}" not found`);
    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const deletedResult = await this.tasksRepository.delete({ id, user });

    if (deletedResult.affected === 0)
      throw new NotFoundException(`Task with id "${id}" not found`);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    return await this.tasksRepository.save(task);
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title: title,
  //     description: description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  // deleteTask(id: string): void {
  //   const found = this.getTask(id)
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTask(id);
  //   task.status = status;
  //   return task;
  // }
  // getTaskFilter(getTaskFilterDto: GetTaskFilterDto): Task[] {
  //   const { status, search } = getTaskFilterDto;
  //   let tasks = this.getTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status == status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) =>
  //       task.title.includes(search) || task.description.includes(search)
  //         ? true
  //         : false,
  //     );
  //   }
  //   return tasks;
  // }
}
