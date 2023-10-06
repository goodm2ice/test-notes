import { memo, useCallback, useState } from 'react'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import { Note } from '../utils/types'

export type NoteCardProps = {
    note: Note
    onNoteEdit?: (id: Note['id'], title: Note['title'], body: Note['body']) => void
    onNoteDelete?: (id: Note['id']) => void
}

export const NoteCard = memo<NoteCardProps>(({ note, onNoteEdit, onNoteDelete }) => {
    const [newNoteTitle, setNewNoteTitle] = useState(note.title)
    const [newNoteBody, setNewNoteBody] = useState(note.body)
    const [isEditing, setIsEditing] = useState(false)

    const onEditingStarted = useCallback(() => {
        setNewNoteTitle(note.title)
        setNewNoteBody(note.body)
        setIsEditing(true)
    }, [note])

    const onEditingEnded = useCallback(() => {
        onNoteEdit?.(note.id, newNoteTitle, newNoteBody)
        setIsEditing(false)
    }, [onNoteEdit, note.id, newNoteTitle, newNoteBody])

    return (
        <Form>
            <Card border={'primary'} bg={'dark'} text={'light'}>
                <Card.Header className={'d-flex justify-content-between'}>
                    {isEditing ? (
                        <Form.Control required onChange={(e) => setNewNoteTitle(e.target.value)} value={newNoteTitle} />
                    ) : (
                        <>
                            <span>{note.title}</span>
                            <div>
                                {onNoteEdit && <Card.Link onClick={onEditingStarted}>Редактировать</Card.Link>}
                                {onNoteDelete && <Card.Link onClick={() => onNoteDelete(note.id)}>Удалить</Card.Link>}
                            </div>
                        </>
                    )}
                </Card.Header>
                <Card.Body>
                    {!isEditing ? note.body : (
                        <Form.Control as={'textarea'} required onChange={(e) => setNewNoteBody(e.target.value)} value={newNoteBody} />
                    )}
                </Card.Body>
                <Card.Footer>
                    {isEditing ? (
                        <>
                            <Card.Link onClick={onEditingEnded}>Сохранить</Card.Link>
                            <Card.Link onClick={() => setIsEditing(false)}>Отменить</Card.Link>
                        </>
                    ) : (
                        <div className={'d-flex justify-content-between'}>
                            <small>Последнее обновление: {new Date(note.lastUpdated).toLocaleString()}</small>
                            <small>Дата создания: {new Date(note.created).toLocaleString()}</small>
                        </div>
                    )}
                </Card.Footer>
            </Card>
        </Form>
    )
})

NoteCard.displayName = 'NoteCard'

export default NoteCard
