export const mapGoalsFromApi = (goalsApi) => {
  return goalsApi
    .filter((el) => el.active)
    .map((e) => ({
      id: e.id,
      value: e.name,
    }));
};
