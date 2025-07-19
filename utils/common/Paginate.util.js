import dotenv from "dotenv";

dotenv.config();

export const paginate = (data, query) => {
  let { page = process.env.PAGE, limit = process.env.LIMIT } = query;

  page = parseInt(page);
  limit = parseInt(limit);

  page = isNaN(page) || page < 1 ? 1 : page;
  limit = isNaN(limit) || limit < 1 ? 10 : limit;
  let total = data.length;
  return {
    page: page,
    limit: limit,
    current_page: page,
    total: total,
    per_page: limit,
    total_pages: Math.ceil(total / limit),
  };
};

export let sliceRanges = (page, limit) => {
  const start = (page - 1) * limit;
  const end = page * limit;
  return { start, end };
};
