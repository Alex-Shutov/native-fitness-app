export const mapBackendToAuthState = (backendData) => {
  return {
    isAuthenticated: true, // если пришли данные пользователя, значит он аутентифицирован
    user: {
      id: backendData.id,
      email: backendData.email,
      username: backendData.username,
      roles: backendData.roles,
      points: backendData.points
    },
    error: null,
    loading: false,
    gender: backendData.gender, // по умолчанию, так как в бекенде нет поля gender
    age: backendData.age, // используем значение с бекенда или дефолтное
    height: backendData.height,
    weight: backendData.weight,
    startWeight: backendData.startWeight, // начальный вес = текущему весу
    targetWeight: backendData.targetWeight, // нет в бекенде, оставляем дефолт
    diet: backendData.dietId,
    goal: backendData.goal,
    bodyMassIndex: calculateBMI(backendData.height, backendData.weight),
    chestCircumference: backendData.chestCircumference ?? '--', // дефолтные значения
    waistCircumference: backendData.waistCircumference ?? '--',
    hipCircumference: backendData.hipCircumference ?? '--',
  };
};

// Вспомогательная функция для расчета ИМТ
const calculateBMI = (height, weight)=> {
  if (!height || !weight) return null;
  return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
};
