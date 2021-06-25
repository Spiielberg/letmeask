import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ReactModal from 'react-modal';

import { toastConfig } from '../config/toastConfig';

import { useRoom } from '../hooks/room';

import { database } from '../services/firebase';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import dangerImg from '../assets/images/danger.svg';
import emptyQuestionsImg from '../assets/images/empty-questions.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { Modal } from '../components/Modal';

import '../styles/room.scss';
import '../styles/modal.scss';

ReactModal.setAppElement('#root');

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const [questionToDelete, setQuestionToDelete] = useState<
    string | undefined
  >();
  const [closeRoomModal, setCloseRoomModal] = useState(false);

  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string | undefined) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

    setQuestionToDelete(undefined);
    toast.success('Pergunta excluída!', toastConfig);
  }

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    toast.success('Sala encerrada!', toastConfig);
    history.push('/');
  }

  function handleCloseModal() {
    setCloseRoomModal(false);
  }

  return (
    <>
      <div id='page-room'>
        <header>
          <div className='content'>
            <img src={logoImg} alt='Letmeask' />

            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={() => setCloseRoomModal(true)}>
                Encerrar sala
              </Button>
            </div>
          </div>
        </header>

        <main>
          <div className='room-title'>
            <h1>Sala {title}</h1>
            {questions.length > 0 && (
              <span>
                {questions.length} pergunta{questions.length > 1 && 's'}
              </span>
            )}
          </div>

          {questions.length > 0 ? (
            <div className='question-list'>
              {questions.map(question => (
                <Question
                  key={question.id}
                  content={question.content}
                  author={question.author}
                >
                  <button
                    type='button'
                    onClick={() => setQuestionToDelete(question.id)}
                  >
                    <img src={deleteImg} alt='Remover pergunta' />
                  </button>
                </Question>
              ))}
            </div>
          ) : (
            <div className='empty-questions'>
              <div>
                <img
                  src={emptyQuestionsImg}
                  alt='Caixas de perguntas e respostas'
                />
                <strong>Nenhuma pergunta por aqui...</strong>
                <p>
                  Envie o código desta sala para seus amigos e <br />
                  comece a responder perguntas!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <Toaster />
      <Modal
        id={questionToDelete}
        onConfirm={handleDeleteQuestion}
        onCancel={() => setQuestionToDelete(undefined)}
      />
      <ReactModal
        className='modal-content'
        overlayClassName='overlay-modal'
        isOpen={closeRoomModal}
        onRequestClose={handleCloseModal}
      >
        <img src={dangerImg} alt='Círculo com um X' />
        <h1>Encerrar sala</h1>
        <p>Tem certeza que você deseja encerrar esta sala?</p>

        <div>
          <Button isCancelButton type='button' onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button isDangerButton type='button' onClick={handleCloseRoom}>
            Sim, encerrar
          </Button>
        </div>
      </ReactModal>
    </>
  );
}
