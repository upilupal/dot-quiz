// /quiz/QuizForm.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Timer from "@/components/timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import Link from "next/link";
import { Toaster } from "react-hot-toast";



interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const QuizForm = () => {
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [currentPoints, setCurrentPoints] = useState<number>(0);
  const [allPossibleAnswers, setAllPossibleAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerCorrectness, setAnswerCorrectness] = useState<boolean | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  const combineAllAnswers = (incorrectAnswers: string[], correctAnswer: string): void => {
    let allAnswers: string[] = [...incorrectAnswers, correctAnswer];
    allAnswers.sort(() => Math.random() - 0.5);
    setAllPossibleAnswers(allAnswers);
  };

  const getTriviaData = async (): Promise<void> => {
    setLoading(true);
    try {
      const resp = await axios.get<{ results: TriviaQuestion[] }>("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple");
      setTriviaQuestions(resp.data.results);
      setCorrectAnswer(resp.data.results[0].correct_answer);
      combineAllAnswers(resp.data.results[0].incorrect_answers, resp.data.results[0].correct_answer);
    } catch (error) {
      console.error("Failed to fetch trivia questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTriviaData();
  }, []);

  const resetQuiz = (): void => {
    setCurrentPoints(0);
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setAnswerCorrectness(null);
    setCorrectAnswersCount(0);
    getTriviaData();
  };

  const verifyAnswer = (selectedAnswer: string): void => {
    if (quizFinished) return;

    setSelectedAnswer(selectedAnswer);
    const isCorrect = selectedAnswer === correctAnswer;
    setAnswerCorrectness(isCorrect);

    if (isCorrect) {
      setCurrentPoints((prevPoints) => prevPoints + 1);
      setCorrectAnswersCount((prevCount) => prevCount + 1);
    }

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < triviaQuestions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setCorrectAnswer(triviaQuestions[nextQuestionIndex].correct_answer);
        combineAllAnswers(triviaQuestions[nextQuestionIndex].incorrect_answers, triviaQuestions[nextQuestionIndex].correct_answer);
        setSelectedAnswer(null);
        setAnswerCorrectness(null);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  const handleTimeOut = (): void => {
    setQuizFinished(true);
  };

  const removeCharacters = (text: string): string => {
    return text
      .replace(/(&quot\;)/g, '"')
      .replace(/(&rsquo\;)/g, "'")
      .replace(/(&#039\;)/g, "'")
      .replace(/(&amp\;)/g, "&");
  };

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
      <header className="App-header">
        {loading ? (
          "Trivia Question Loading..."
        ) : (
          <div>
            {!quizFinished ? (
              <>
                <Card className="w-[500px]">
                  {triviaQuestions.length > 0 && (
                    <>
                      <CardHeader>
                        <div className="flex justify-between mb-3">
                          <Card className="px-3 py-2">
                            <Timer onTimeOut={handleTimeOut} />
                          </Card>
                          <Card className="px-3 py-2">
                            Question {currentQuestionIndex + 1}/{triviaQuestions.length}
                          </Card>
                        </div>
                        <p className="text-wrap">{removeCharacters(triviaQuestions[currentQuestionIndex].question)}</p>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-3">
                        {allPossibleAnswers.map((answer, index) => (
                          <div key={index}>
                            <Button
                              onClick={() => verifyAnswer(answer)}
                              disabled={selectedAnswer !== null}
                              className={`w-full ${
                                selectedAnswer === answer
                                  ? answerCorrectness
                                    ? "bg-green-500"
                                    : "bg-red-800"
                                  : ""
                              }`}
                            >
                              {removeCharacters(answer)}
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </>
                  )}
                </Card>
              </>
            ) : (
              <Card className="w-[500px] h-[350px] p-5 flex flex-col justify-evenly">
                <h2 className="text-xl font-bold mb-4">Quiz Finished!</h2>
                <div className="flex justify-around items-center">
                  <div className="flex flex-col text-center font-semibold text-xl">
                    <h3 className="">Correct Answers</h3>
                    <h3>
                      {correctAnswersCount}/{triviaQuestions.length}
                    </h3>
                  </div>
                  <div className="flex flex-col text-center font-semibold text-xl">
                    <h3>Final Score</h3>
                    <h3>{correctAnswersCount * 10}</h3>
                  </div>
                </div>
                <div>
                  <Button onClick={resetQuiz} className="mt-4 w-full">
                    Start New Quiz
                  </Button>
                  <Link href={"/"}>
                    <Button className="mt-4 w-full">Back to menu</Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        )}
      </header>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default QuizForm;