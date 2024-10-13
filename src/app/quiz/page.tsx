// /quiz/page.tsx
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import QuizForm from "./quizForm";


const QuizPage = async () => {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <QuizForm/>
    </div>
  );
};

export default QuizPage;