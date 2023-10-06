import { Card, Container, Form, Nav, Navbar } from 'react-bootstrap'
import { useCallback, useMemo, useState } from 'react'

import NoteCard from './components/NoteCard'
import useNotes from './utils/useNotes'

const SORT_OPTIONS = [
    { value: 'title', label: 'Название' },
    { value: 'lastUpdated', label: 'Дата обновления' },
    { value: 'created', label: 'Дата создания' },
] as const

const SORT_ORDERS = [
    { value: 'asc', label: 'По возрастанию' },
    { value: 'desc', label: 'По убыванию' },
] as const

export const App = () => {
    const [notes, addNote, editNote, deleteNote, resetNotes] = useNotes()

    const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]['value']>('title')
    const [sortOrder, setSortOrder] = useState<(typeof SORT_ORDERS)[number]['value']>('asc')
    const sortedNotes = useMemo(() => {
        const newNotes = [...notes]

        newNotes.sort((a, b) =>
            (sortOrder === 'asc' ? 1 : -1) * String(a[sortBy]).localeCompare(String(b[sortBy]))
        )

        return newNotes
    }, [notes, sortBy, sortOrder])

    const [addingNew, setAddingNew] = useState(false)
    const [newNoteTitle, setNewNoteTitle] = useState('')
    const [newNoteBody, setNewNoteBody] = useState('')

    const onNoteAddingStarted = useCallback(() => {
        setAddingNew(true)
        setNewNoteTitle('')
        setNewNoteBody('')
    }, [])

    const onNoteAddingEnd = useCallback(() => {
        addNote(newNoteTitle, newNoteBody)
        setAddingNew(false)
    }, [addNote, newNoteTitle, newNoteBody])

    return (
        <div className={'bg-dark d-flex flex-column'} style={{ width: '100vw', height: '100vh', maxHeight: '100vh' }}>
            <Navbar bg={'primary'} data-bs-theme={'dark'}>
                <Container>
                    <Navbar.Brand>Заметки</Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link onClick={onNoteAddingStarted}>Добавить заметку</Nav.Link>
                            <Nav.Link onClick={resetNotes}>Очистить заметки</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <div className={'d-flex gap-2'}>
                        <Form.Select onChange={(e) => setSortBy(e.target.value as typeof sortBy)} defaultValue={sortBy}>
                            {SORT_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Form.Select>
                        <Form.Select onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)} defaultValue={sortOrder}>
                            {SORT_ORDERS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </Form.Select>
                    </div>
                </Container>
            </Navbar>
            {addingNew && (
                <Container className={'pt-4'}>
                    <Form>
                        <Card border={'success'} bg={'dark'} text={'light'}>
                            <Card.Header>
                                <Form.Label>Заголовок</Form.Label>
                                <Form.Control required onChange={(e) => setNewNoteTitle(e.target.value)} value={newNoteTitle} />
                            </Card.Header>
                            <Card.Body>
                                <Form.Label>Текст</Form.Label>
                                <Form.Control as={'textarea'} required onChange={(e) => setNewNoteBody(e.target.value)} value={newNoteBody} />
                            </Card.Body>
                            <Card.Footer>
                                <Card.Link onClick={onNoteAddingEnd}>Сохранить</Card.Link>
                                <Card.Link onClick={() => setAddingNew(false)}>Отменить</Card.Link>
                            </Card.Footer>
                        </Card>
                    </Form>
                </Container>
            )}
            <Container style={{ flex: 1, overflow: 'hidden' }}>
                <div className={'d-flex flex-column py-4 h-100 overflow-hidden'}>
                    <div className={'d-flex flex-column h-auto gap-3 overflow-auto'}>
                        {sortedNotes?.map((note) => (
                            <NoteCard
                                key={`${note.id}`}
                                note={note}
                                onNoteEdit={editNote}
                                onNoteDelete={deleteNote}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default App
