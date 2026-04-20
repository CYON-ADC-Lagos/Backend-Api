const parsePagination = (query, defaults = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const defaultLimit = defaults.limit || 20;
  const maxLimit = defaults.max || 100;
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const buildPaginated = (rowsAndCount, { page, limit }) => ({
  items: rowsAndCount.rows,
  total: rowsAndCount.count,
  page,
  pageSize: limit,
  pages: Math.max(1, Math.ceil(rowsAndCount.count / limit)),
});

module.exports = { parsePagination, buildPaginated };
