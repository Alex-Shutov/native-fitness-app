// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const updateProfileField = async (fieldName, value) => {
  await delay(300 + Math.random() * 500);

  // // Simulate random API failures (10% chance)
  // if (Math.random() < 0.1) {
  //   throw new Error(`Failed to update ${fieldName}`);
  // }
  //
  // console.log(`API: Updated ${fieldName} to ${value}`);

  // Return success response
  return {
    success: true,
    data: {
      [fieldName]: value,
    },
  };
};


export const fetchProfile = async (userId) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 700));

  // Return mock profile data
  return {
    success: true,
    data: {
      name: 'Ника Берестова',
      image: null, // This would be a URL in a real app
      currentWeight: '53',
      targetWeight: '50',
      goal: 'Карьера',
      age: '46',
      gender: 'Женский',
      height: '102',
      phone: '+7 (919) 906 00-77',
      email: 'nika_ber@mail.ru',
    }
  };
};