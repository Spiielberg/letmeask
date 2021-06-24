import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { toastConfig } from '../config/toastConfig';

import { useAuth } from '../hooks/auth';
import { useRoom } from '../hooks/room';

import { database } from '../services/firebase';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const [newQuestion, setNewQuestion] = useState('');

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { user } = useAuth();
  const { questions, title } = useRoom(roomId);

  async function handleSendQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isAnswered: false,
      isHighlighted: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    toast.success('Pergunta enviada!', toastConfig);
    setNewQuestion('');
  }

  return (
    <>
      <div id='page-room'>
        <header>
          <div className='content'>
            <img src={logoImg} alt='Letmeask' />

            <div>
              <RoomCode code={roomId} />
              <Button isOutlined>Encerrar sala</Button>
            </div>
          </div>
        </header>

        <main>
          <div className='room-title'>
            <h1>Sala: {title}</h1>
            {questions.length > 0 && (
              <span>
                {questions.length} pergunta{questions.length > 1 && 's'}
              </span>
            )}
          </div>

          <div className='question-list'>
            {questions.map(question => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              />
            ))}
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
