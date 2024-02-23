export const getPagenation = async (
  page: number,
  limit: number,
  total: number
) => {
  const offset = page * limit - limit;

  return {
    db: {
      take: limit,
      skip: offset,
    },
    meta: {
      currentPage: page || 1,
      totalPages: Math.ceil(total / limit) || 1,
      totalItems: total,
    },
  };
};
