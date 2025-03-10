export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateNotEmpty = (prop) =>{
  return prop && prop?.length > 0;
}

export const validatePhone = (phone) => {
  return phone && phone.length < 10
}