import { create } from 'zustand'
import { persist } from 'zustand/middleware'


const initialState = {
    questions: [],
    snippets: [],
    evaluation: [],
    loading: false
}

const QnaSnipEvalStore = create(
    persist(
        (set) => ({
            ...initialState,
            setQuestions: (questions) => set({ questions }),
            setSnippets: (snippets) => set({ snippets }),
            setEvaluation: (evaluation) => set({ evaluation }),
            setLoading: (loading) => set({ loading })
        }),
        {
            name: 'qna-snip-eval-storage',
            // Only persist these keys, excluding 'loading'
            partialize: (state) => ({
                questions: state.questions,
                snippets: state.snippets,
                evaluation: state.evaluation
            })
        }
    )
)



export default QnaSnipEvalStore;