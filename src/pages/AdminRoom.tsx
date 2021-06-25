import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import ReactModal from 'react-modal';
import classNames from 'classnames';

import { modalConfig } from '../config/modalConfig';
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

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
      isHighlighted: false,
    });
  }

  async function handleCheckQuestionAsNotAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: false,
    });
  }

  function handleHighlightQuestion(questionId: string) {
    questions.forEach(async question => {
      if (question.id === questionId) {
        await database.ref(`rooms/${roomId}/questions/${question.id}`).update({
          isHighlighted: true,
        });
      } else if (question.isHighlighted) {
        await database.ref(`rooms/${roomId}/questions/${question.id}`).update({
          isHighlighted: false,
        });
      }
    });
  }

  async function handleRemoveHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: false,
    });
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
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {!question.isAnswered && (
                    <button
                      className={classNames({
                        highlighted: question.isHighlighted,
                      })}
                      type='button'
                      onClick={
                        question.isHighlighted
                          ? () => handleRemoveHighlightQuestion(question.id)
                          : () => handleHighlightQuestion(question.id)
                      }
                    >
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z'
                          stroke='#737380'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    className={classNames({
                      answered: question.isAnswered,
                    })}
                    type='button'
                    onClick={
                      question.isAnswered
                        ? () => handleCheckQuestionAsNotAnswered(question.id)
                        : () => handleCheckQuestionAsAnswered(question.id)
                    }
                  >
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <circle
                        cx='12.0003'
                        cy='11.9998'
                        r='9.00375'
                        stroke='#737380'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                      <path
                        d='M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193'
                        stroke='#737380'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </button>
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
        style={modalConfig}
        className='modal-content'
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
