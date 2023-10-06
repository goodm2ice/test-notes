import { useCallback } from 'react'

import useStorage from './useStorage'
import { Note } from './types'

export const useNotes = () => {
    const [notes, setNotes, resetNotes] = useStorage<Note[]>('notes', [])

    const addNote = useCallback((title: Note['title'], body: Note['body']) => {
        const now = Date.now()
        setNotes((prev) => [...(prev || []), { id: +now, title, body, created: now, lastUpdated: now }])
    }, [setNotes])

    const editNote = useCallback((id: Note['id'], title: Note['title'], body: Note['body']) => {
        setNotes((prev) => {
            if (!prev) return prev
            const newNotes = [...prev]
            const idx = newNotes.findIndex((note) => note.id === id)
            if (idx < 0) return prev
            newNotes[idx].title = title
            newNotes[idx].body = body
            newNotes[idx].lastUpdated = Date.now()
            return newNotes
        })
    }, [setNotes])

    const deleteNote = useCallback((id: Note['id']) => {
        setNotes((prev) => {
            if (!prev) return prev
            const newNotes = [...prev]
            const idx = newNotes.findIndex((note) => note.id === id)
            if (idx < 0) return prev
            newNotes.splice(idx, 1)
            return newNotes
        })
    }, [setNotes])

    return [notes, addNote, editNote, deleteNote, resetNotes] as const
}

export default useNotes
