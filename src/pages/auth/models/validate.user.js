import { z } from 'zod';

// Define validation messages
const messages = {
  name: {
    required: 'Имя обязательно',
    minLength: 'Имя должно содержать не менее 2 символов',
  },
  email: {
    required: 'Email обязателен',
    invalid: 'Введите корректный адрес электронной почты',
  },
  phone: {
    invalid: 'Введите корректный номер телефона',
  },
  password: {
    required: 'Пароль обязателен',
    minLength: 'Пароль должен содержать не менее 6 символов',
    digit: 'Пароль должен содержать хотя бы одну цифру',
  },
  agreement: {
    required: 'Необходимо принять соглашение',
  },
};

// Define validation schema using Zod
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: messages.name.minLength })
    .nonempty({ message: messages.name.required }),

  email: z
    .string()
    .nonempty({ message: messages.email.required })
    .email({ message: messages.email.invalid }),

  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, { message: messages.phone.invalid }),

  password: z
    .string()
    .nonempty({ message: messages.password.required })
    .min(6, { message: messages.password.minLength })
    .refine((val) => /\d/.test(val), { message: messages.password.digit }),

  agreementAccepted: z
    .boolean()
    .refine((val) => val === true, { message: messages.agreement.required }),
});
