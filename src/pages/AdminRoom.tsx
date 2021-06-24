import { useHistory, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { toastConfig } from '../config/toastConfig';

import { useRoom } from '../hooks/room';

import { database } from '../services/firebase';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import '../styles/room.scss';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

      toast.success('Pergunta excluída!', toastConfig);
    }
  }

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que você deseja encerrar esta sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        closedAt: new Date(),
      });

      toast.success('Sala encerrada!', toastConfig);
      history.push('/');
    }
  }

  return (
    <>
      <div id='page-room'>
        <header>
          <div className='content'>
            <img src={logoImg} alt='Letmeask' />

            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={handleEndRoom}>
                Encerrar sala
              </Button>
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
              >
                <button
                  type='button'
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt='Remover pergunta' />
                </button>
              </Question>
            ))}
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
