"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const questions = [
  { type: "text", question: "O que você mais gostou em nosso atendimento?" },
  { type: "emoji", question: "Como você avalia o tempo de espera?" },
  { type: "emoji", question: "Como você avalia a cordialidade da nossa equipe?" },
  { type: "emoji", question: "Você recomendaria o Hospital Dom da Vida para amigos/familiares?" },
  { type: "emoji", question: "Como você avalia a limpeza e organização do hospital?" },
  { type: "emoji", question: "Como você avalia a clareza das informações recebidas?" },
  { type: "emoji", question: "Como você avalia a disponibilidade de atendimento?" },
]

const answers = ["😡", "😕", "😐", "🙂", "🤩"]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [textResponse, setTextResponse] = useState<string>("");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("satisfaction_responses");
    if (saved) {
      setResponses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("satisfaction_responses", JSON.stringify(responses));
  }, [responses]);

  const handleAnswer = (emoji: string) => {
    const updated = [...responses];
    updated[currentStep] = emoji;
    setResponses(updated);
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setFinished(true);
  };

  if (finished) {
    return (
      <main className="w-full min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 flex flex-col items-center justify-center p-4 md:p-10">
        <Card className="w-full max-w-2xl rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md text-center p-10">
          <CardTitle className="text-3xl md:text-4xl font-bold text-zinc-800 mb-4">
            Obrigado por responder!
          </CardTitle>
          <p className="text-zinc-700 text-lg md:text-xl mb-6">
            Suas respostas nos ajudam a melhorar cada vez mais nosso atendimento.
          </p>

          {/* Ícones decorativos */}
          <div className="flex justify-center gap-6 text-4xl md:text-5xl mb-6">
            <span>💚</span>
            <span>🏥</span>
            <span>✨</span>
          </div>

          <p className="text-zinc-600 text-base md:text-lg mb-4">
            Sua opinião é essencial para que possamos oferecer um serviço cada vez melhor.
          </p>

          <p className="text-zinc-500 text-sm md:text-base">
            Compartilhe essa experiência com seus amigos e familiares! Cada feedback conta.
          </p>

          <Button onClick={() => {
            setFinished(false)
            setCurrentStep(0)
            setResponses(Array(questions.length).fill(null))
            setTextResponse("")
          }}>
            Voltar ao início
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <>
      <main className="w-full min-h-screen bg-zinc-200 flex flex-col items-center">
        <section className="w-full h-20 bg-zinc-300/60 border-b border-zinc-400 backdrop-blur-sm shadow-xl flex items-center justify-between pr-8 lg:px-40 z-20">
          <img src="./logo.png" alt="Dom Da Vida" className="h-28 select-none" />
          <div className="size-10 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center p-1 text-zinc-50/80">
            <User className="size-5" />
          </div>
        </section>

        <section className="flex items-center justify-center w-full flex-1 p-2 md:p-10 relative z-10">
          <Card className="w-full max-w-lg rounded-2xl shadow-xl border-0 bg-white/90 backdrop-blur-md">
            {/* Progress */}
            <div className="px-6 pt-4">
              <Progress
                value={((currentStep + 1) / questions.length) * 100}
                className="h-2 rounded-full"
              />
            </div>

            {/* Pergunta */}
            <CardHeader>
              <CardTitle className="text-center text-lg md:text-2xl font-semibold text-zinc-800">
                {questions[currentStep].question}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-6 items-center pb-6">
              {/* Emojis */}
              {questions[currentStep].type === "emoji" ? (
                <div className="flex gap-4 md:gap-6 text-3xl md:text-4xl">
                  {answers.map((emoji) => (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 md:p-3 rounded-full transition shadow-sm ${responses[currentStep] === emoji
                        ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md"
                        : "bg-zinc-100 hover:bg-zinc-200"
                        }`}
                      onClick={() => handleAnswer(emoji)}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4 w-full px-4 md:px-8">
                  <Input
                    placeholder="Digite sua resposta"
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                  />
                </div>
              )}

              {/* Navegação */}
              <div className="flex justify-between w-full px-4 md:px-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="rounded-full cursor-pointer"
                >
                  Voltar
                </Button>
                {currentStep < questions.length - 1 ? (
                  <>
                    {currentStep === 0 ? (
                      <Button
                        onClick={nextStep}
                        disabled={!textResponse}
                        className="rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md hover:opacity-90 cursor-pointer"
                      >
                        Próximo
                      </Button>
                    ) : (
                      <Button
                        onClick={nextStep}
                        disabled={!responses[currentStep]}
                        className="rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white shadow-md hover:opacity-90 cursor-pointer"
                      >
                        Próximo
                      </Button>
                    )}
                  </>
                ) : (
                  <Button
                    onClick={handleFinish}
                    disabled={!responses[currentStep]}
                    className="rounded-full bg-green-600 text-white shadow-md hover:bg-green-700 cursor-pointer"
                  >
                    Finalizar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Detalhes de fundo decorativo */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(255,200,0,0.3),transparent)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_rgba(0,150,255,0.3),transparent)] pointer-events-none" />
      </main>
    </>
  );
}
