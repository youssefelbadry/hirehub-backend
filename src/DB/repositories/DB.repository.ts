import {
  CreateOptions,
  HydratedDocument,
  Model,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export class DataBaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create({
    data,
    options,
  }: {
    data: Partial<T>;
    options?: CreateOptions;
  }): Promise<HydratedDocument<T>> {
    const doc = new this.model(data);
    const saved = await doc.save(options);
    return saved as HydratedDocument<T>;
  }

  async findOne({
    filter,
    select,
    options,
  }: {
    filter: QueryFilter<T>;
    select?: any;
    options?: QueryOptions;
  }) {
    return this.model.findOne(filter, select, options);
  }

  async find({
    filter,
    select,
    options,
  }: {
    filter?: QueryFilter<T>;
    select?: any;
    options?: QueryOptions;
  }) {
    return this.model.find(filter, select, options);
  }

  async findById({
    id,
    select,
    options,
  }: {
    id?: any;
    select?: any;
    options?: QueryOptions;
  }) {
    return this.model.findById(id, select, options);
  }

  async findByIdAndUpdate({
    id,
    update,
    options,
  }: {
    id: string;
    update: UpdateQuery<T>;
    options?: QueryOptions;
  }) {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  async findOneAndUpdate({
    filter,
    update,
    options,
  }: {
    filter: QueryFilter<T>;
    update: UpdateQuery<T>;
    options?: QueryOptions;
  }) {
    return this.model.findOneAndUpdate(filter, update, {
      new: true,
      ...options,
    });
  }

  async deleteOne(filter: QueryFilter<T>) {
    return this.model.deleteOne(filter);
  }

  async findByIdAndDelete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
