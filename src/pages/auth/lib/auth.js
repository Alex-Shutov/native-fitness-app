

export const getUserValue = (formData) => {
  const user = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
  };

  return {
    isAuthenticated: true,
    user,
    error: null,
    loading: false,
  }
}