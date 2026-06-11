import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, HelpCircle } from 'lucide-react'
import Badge from '../ui/Badge'

function QuestionModal({ question, locked, selectedAnswer, hintsLeft, onUseHint, onAnswer }) {
  const [hintState, setHintState] = useState({ questionId: null, visible: false })

  if (!question) return null

  const showHint = hintState.questionId === question.id && hintState.visible
  const options = Array.isArray(question.opciones)
    ? question.opciones
    : [question.opcion_a, question.opcion_b, question.opcion_c, question.opcion_d].filter(Boolean)
  const relatedOds = question.ods_relacionado || question.ods_numero
  const difficultyLabel = question.dificultad === 'avanzado' ? 'reto ODS' : 'reto con pista'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 px-4 backdrop-blur-md">
      <motion.article
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-lg border border-emerald-300/25 bg-slate-950/95 p-6 shadow-2xl shadow-emerald-950/40"
      >
        <Badge icon={HelpCircle}>{difficultyLabel} ODS {relatedOds}</Badge>
        <h2 className="mt-4 text-2xl font-black tracking-normal text-white">
          Reto ODS para avanzar
        </h2>
        {question.missionTitle && (
          <p className="mt-2 text-sm font-black text-emerald-200">{question.missionTitle}</p>
        )}
        <p className="mt-3 text-base leading-7 text-slate-300">{question.pregunta}</p>
        {question.explicacion && showHint && (
          <p className="mt-3 rounded-lg border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm font-bold leading-6 text-sky-100">
            Pista: {question.explicacion}
          </p>
        )}
        {question.explicacion && !showHint && (
          <button
            type="button"
            disabled={locked || hintsLeft <= 0}
            onClick={() => {
              setHintState({ questionId: question.id, visible: true })
              onUseHint()
            }}
            className="mt-3 rounded-lg border border-sky-300/25 bg-sky-400/10 px-4 py-2 text-sm font-black text-sky-100 transition hover:bg-sky-400/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {hintsLeft > 0 ? `Ver pista (${hintsLeft})` : 'Sin pistas disponibles'}
          </button>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selectedAnswer === option
            const isCorrect = locked && option === question.respuesta_correcta
            const isWrong = locked && isSelected && !isCorrect

            return (
              <button
                key={option}
                disabled={locked}
                onClick={() => onAnswer(option)}
                className={[
                  'min-h-16 rounded-lg border px-4 py-3 text-left text-sm font-black transition duration-300',
                  isCorrect
                    ? 'border-lime-300/70 bg-lime-400/20 text-lime-100'
                    : 'border-white/10 bg-white/5 text-white hover:border-emerald-300/45 hover:bg-emerald-400/10',
                  isWrong ? 'border-red-300/70 bg-red-400/20 text-red-100' : '',
                ].join(' ')}
              >
                <span className="flex items-center gap-2">
                  {isCorrect && <CheckCircle2 className="size-5" />}
                  {option}
                </span>
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-400">
          No pasa nada si fallas. Sigue aprendiendo.
        </p>
      </motion.article>
    </div>
  )
}

export default QuestionModal
