import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { User } from 'src/auth/user.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger();
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
      user: user,
    });

    return await this.save(task);
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task'); //alias for Task db

    //find the task belongs to user
    query.where({ user });

    if (status) {
      query.andWhere('task.statuss = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', //put extra parenthesis at the beginning and ending () to make it as a single statement
        {
          search: `%${search}%`, //as long as it matches any single value in search variable
        },
      );
      //same with
      // query.andWhere(
      //   new Brackets((qb) => {
      //     qb.where(
      //       'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
      //       {
      //         search: `%${search}%`, //as long as it matches any single value in search variable
      //       },
      //     );
      //   }),
      // );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user ${
          user.username
        }. Filter: ${JSON.stringify(filterDto)}`,
      );
      throw new InternalServerErrorException();
    }
  }
}
