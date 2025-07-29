import { atom, selector } from 'recoil';
import { authState } from '../../auth/models/auth.atom';
import QuizService from '../api/quiz.service';

export const quizState = atom({
  key: 'quizState',
  default: {
    questions: [],
    answers: {},
    currentQuestionIndex: 0,
    isFinished: false,
    result: null,
  },
});

// Новый атом для отслеживания версии викторины
export const quizVersionState = atom({
  key: 'quizVersionState',
  default: 0,
});

export const quizQuery = selector({
  key: 'quizQuery',
  get: async ({ get }) => {
    // Добавляем зависимость от версии викторины
    get(quizVersionState);

    const userId = get(authState).user.id;
    // const promises = Array.from({ length: 10 }, () =>
    //   QuizService.getRandomQuestion(userId)
    // );
    // const results = await Promise.allSettled(promises);
    // const questions = results
    //   .filter(result => result.status === 'fulfilled')
    //   .map(result => result.value);
    const questions = QuizService.getQuestionsBatch(userId);
    return questions;
  },
});