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
