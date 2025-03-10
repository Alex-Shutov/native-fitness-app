const mockToken = 'mock-auth-token-' + Math.random().toString(36).substring(2);


export const getUserValue = (formData) => {
  const user = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
  };

  return {
    isAuthenticated: true,
    user,
    token: mockToken,
    error: null,
    loading: false,
  }
}