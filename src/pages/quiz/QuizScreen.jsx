import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Image,
  BackHandler,
  ScrollView,
} from 'react-native';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import QuizService from './api/quiz.service';
import { quizQuery, quizState, quizVersionState } from './state/quiz.state';
import { BORDER_RADIUS, COLORS, SPACING } from '../../core/styles/theme';
import Button from '../../shared/ui/button';
import ScreenBackground from '../../shared/ui/layout/ScreenBackground';
import ScreenTransition from '../../shared/ui/layout/ScreenTransition';
import RadioButtonGroup from '../../shared/ui/radio';
import { Typo } from '../../shared/ui/typo';
import InfoModal from '../../widgets/modal/InfoModal';
import { authState } from '../auth/models/auth.atom';

const QuizScreen = ({ route }) => {
  const [quiz, setQuiz] = useRecoilState(quizState);
  const quizLoadable = useRecoilValueLoadable(quizQuery);
  const { fromStartButton } = route.params || {};

  const [showExitConfirm, setShowExitConfirm] = React.useState(false);
  const [showResultsModal, setShowResultsModal] = React.useState(false);
  const [quizVersion, setQuizVersion] = useRecoilState(quizVersionState);
  const navigation = useNavigation();
  const [answerChecked, setAnswerChecked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [rightAnswer, setRightAnswer] = useState(null);
  const [auth, _] = useRecoilState(authState);
  const [noQuestionsModalVisible, setNoQuestionsModalVisible] = useState(false);
  const handleBackPress = useCallback(() => {
    setShowExitConfirm(true);
    return true; // Предотвращаем действие по умолчанию
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      // Добавляем слушатель для жеста свайпа назад
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        // Предотвращаем стандартное поведение
        e.preventDefault();
        setShowExitConfirm(true);
      });

      return () => {
        backHandler.remove();
        unsubscribe();
      };
    }, [handleBackPress, navigation])
  );

  useEffect(() => {
    if (quizLoadable.state === 'hasValue') {
      if (quizLoadable.contents.length === 0) {
        setNoQuestionsModalVisible(true);
      } else {
        setQuiz((prev) => ({
          ...prev,
          questions: quizLoadable.contents,
        }));
      }
    }
  }, [quizLoadable, setQuiz]);

  const handleCloseNoQuestionsModal = () => {
    setNoQuestionsModalVisible(false);
    navigation.navigate('MainScreen');
    navigation.setParams({ fromStartButton: false });
  };

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswer(answerId);
    setQuiz((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [quiz.questions[quiz.currentQuestionIndex].id]: answerId,
      },
    }));
  };

  const checkAnswer = async () => {
    const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
    setRightAnswer(currentQuestion.rightAnswer.id);
    const isCorrect = selectedAnswer === currentQuestion.rightAnswer.id;
    setAnswerChecked(true);

    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleConfirmExit = () => {
    // Сбрасываем состояние викторины
    setQuiz({
      questions: [],
      answers: {},
      currentQuestionIndex: 0,
      isFinished: false,
      result: null,
    });
    setQuizVersion((prev) => prev + 1);
    setShowExitConfirm(false);
    // Здесь можно добавить навигацию назад, если нужно
    navigation.navigate('MainScreen');
  };

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleNextQuestion = () => {
    setAnswerChecked(false);
    setSelectedAnswer(null);
    setRightAnswer(null);
    setQuiz((prev) => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1,
    }));
    if (quiz.currentQuestionIndex >= quiz.questions.length - 2) {
      setQuiz((prev) => ({
        ...prev,
        isFinished: true,
      }));
    }
  };

  const handleFinishQuiz = async () => {
    const handleCheckLastQuestion = () => {
      const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
      setRightAnswer(currentQuestion.rightAnswer.id);
      setAnswerChecked(true);
    };
    const handleFinishQuizAfterCheckLastQuestion = async () => {
      const answers = Object.entries(quiz.answers).map(([questionId, answerId]) => ({
        userId: auth.user.id,
        questionId: Number(questionId),
        answerId: Number(answerId),
      }));

      // Используем новый метод для проверки всех ответов одним запросом
      const results = await QuizService.checkAnswersBatch(answers);
      // Подсчитываем количество правильных ответов

      setQuiz((prev) => ({
        ...prev,
        result: {
          correct: results.score,
          total: results.total,
        },
      }));
      setShowResultsModal(true);
    };
    try {
      handleCheckLastQuestion();
      // Преобразуем ответы в нужный формат
      await handleFinishQuizAfterCheckLastQuestion()
    } catch (error) {
      console.error('Error finishing quiz:', error);
      try {
        const fallbackResults = await Promise.all(
          Object.entries(quiz.answers).map(([questionId, answerId]) =>
            QuizService.checkAnswer(auth.user.id, Number(questionId), Number(answerId))
          )
        );
        const correctCount = fallbackResults.filter(Boolean).length;

        setQuiz((prev) => ({
          ...prev,
          result: {
            correct: correctCount,
            total: quiz.questions.length,
          },
        }));
        setShowResultsModal(true);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        // Показываем пользователю сообщение об ошибке
        alert('Произошла ошибка при проверке ответов. Пожалуйста, попробуйте позже.');
      }
    }
  };

  const renderExitConfirmationModal = () => {
    return (
      <Modal visible={showExitConfirm} transparent statusBarTranslucent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Typo variant="hSub" style={styles.modalTitle}>
              Завершить викторину?
            </Typo>
            <View style={styles.modalButtons}>
              <Button title="Нет" onPress={handleCancelExit} style={styles.modalButton} />
              <Button title="Да" onPress={handleConfirmExit} style={styles.modalButton} />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderQuestion = () => {
    const currentQuestion = quiz.questions[quiz.currentQuestionIndex];
    if (!currentQuestion) return null;
    const rightAnswer = currentQuestion.rightAnswer;

    return (
      <ScreenTransition>
        <ScreenBackground
          hasBackButton={false}
          contentStyle={styles.questionContainer}
          title={
            <View style={styles.headerContainer}>
              <Typo variant="hSub" style={styles.header}>
                Викторина
              </Typo>
            </View>
          }>
          {currentQuestion.imageUrl && (
            <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  currentQuestion.imageUrl ??
                  'https://img.freepik.com/free-vector/modern-stylish-problem-solving-faq-symbol-background-design_1017-58258.jpg?semt=ais_hybrid&w=740',
              }}
              style={styles.image}
              onError={(e) => console.log('Image error:', e.nativeEvent.error)}
              onLoad={() => console.log('Image loaded successfully')}
            />
            </View>
          )}
          <ScrollView showsVerticalScrollIndicator style={styles.scrollContent}>
            <Typo variant="hSub" style={styles.questionHeader}>
              Вопрос {quiz.currentQuestionIndex + 1}
            </Typo>
            <Typo variant="body1" style={styles.questionText}>
              {currentQuestion.questionText}
            </Typo>
            <RadioButtonGroup
              answerChecked={answerChecked}
              rightAnswer={rightAnswer}
              options={currentQuestion.answers.map((answer) => ({
                label: answer.answerText,
                value: answer.id,
              }))}
              onValueChange={handleAnswerSelect}
            />
          </ScrollView>
        </ScreenBackground>
      </ScreenTransition>
    );
  };

  const renderResultModal = () => {
    if (!quiz.result) return null;

    return (
      <Modal visible={showResultsModal} transparent statusBarTranslucent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Typo variant="hSub" style={styles.modalTitle}>
              Ваш результат
            </Typo>
            <Typo variant="body0" style={styles.modalText}>
              {`${quiz.result.correct}/${quiz.result.total}`}
            </Typo>
            <Button
              title="Закрыть"
              onPress={() => {
                setQuizVersion((prev) => prev + 1);
                setQuiz({
                  questions: [],
                  answers: {},
                  currentQuestionIndex: 0,
                  isFinished: false,
                  result: null,
                });
                navigation.navigate('MainScreen');
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  if (quizLoadable.state === 'hasValue' && quizLoadable.contents.length === 0 && fromStartButton) {
    return (
      <InfoModal
        text="На данный момент все вопросы кончились. Вы можете попробовать позднее, когда для вас появятся новые вопросы"
        visible={noQuestionsModalVisible}
        onClose={handleCloseNoQuestionsModal}
        title="Вопросы кончились!"
      />
    );
  }

  return (
    <View style={styles.container}>
      {quizLoadable.state === 'loading' && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary.main} />
          <Typo variant="body1">Подождите, загружаем викторину...</Typo>
        </View>
      )}

      {quizLoadable.state === 'hasValue' && (
        <>
          {renderQuestion()}
          <Button
            title={
              quiz.isFinished
                ? 'Завершить викторину'
                : answerChecked
                  ? 'Продолжаем...'
                  : 'Проверить ответ'
            }
            onPress={quiz.isFinished ? handleFinishQuiz : answerChecked ? null : checkAnswer}
            disabled={!selectedAnswer || answerChecked}
          />
        </>
      )}
      {renderExitConfirmationModal()}
      {renderResultModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  container: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.page.background,
  },
  questionContainer: {
    marginBottom: SPACING.lg,
    flex: 1,
  },
  questionText: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    maxHeight: 250,
    paddingVertical: SPACING.xl,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    resizeMode: 'contain',
  },
  loadingContainer: {
    backgroundColor: COLORS.page.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.neutral.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  modalTitle: {
    fontSize: SPACING.xl,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  headerContainer: {
    display: 'flex',
    width: '100%',
    flex: 1,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingRight: SPACING.xl * 1.2,
    textAlign: 'left',
  },
  questionHeader: {
    fontSize: SPACING.xl,
    textAlign: 'left',
    marginVertical: SPACING.sm,
  },
});

export default QuizScreen;
