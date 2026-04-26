import { Model } from "mongoose";

interface PaginateOptions<T> {
  model: Model<T>;
  filter?: any;
  page?: number;
  limit?: number;
  sort?: any;
  populate?: any;
  select?: any;
}

export async function paginate<T>({
  model,
  filter = {},
  page = 1,
  limit = 10,
  sort = { createdAt: -1 },
  populate,
  select,
}: PaginateOptions<T>) {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Number(limit) || 10, 50);
  const skip = (pageNumber - 1) * limitNumber;

  // total
  const total = await model.countDocuments(filter);

  // query
  let query = model.find(filter).skip(skip).limit(limitNumber).sort(sort);

  if (populate) {
    query = query.populate(populate);
  }

  if (select) {
    query = query.select(select);
  }

  const data = await query.exec();

  return {
    data,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: total > 0 ? Math.ceil(total / limitNumber) : 1,
      hasNext: pageNumber < Math.ceil(total / limitNumber),
      hasPrev: pageNumber > 1,
    },
  };
}
