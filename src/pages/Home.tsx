import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { toastConfig } from '../config/toastConfig';

import { useAuth } from '../hooks/auth';

import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function Home() {
  const [roomCode, setRoomCode] = useState('');
  const { user, signInWithGoogle } = useAuth();
  const history = useHistory();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error('Esta sala não existe!', toastConfig);
      return;
    }

    if (roomRef.val().closedAt) {
      toast.error('Esta sala já foi encerrada!', toastConfig);
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <>
      <div id='page-auth'>
        <aside>
          <img
            src={illustrationImg}
            alt='Ilustração simbolizando perguntas e respostas'
          />
          <strong>Crie salas de Q&amp;A ao vivo</strong>
          <p>Tire as dúvidas da sua audiência em tempo real</p>
        </aside>
        <main>
          <div className='main-content'>
            <img src={logoImg} alt='Letmeask' />
            <button className='create-room' onClick={handleCreateRoom}>
              <img src={googleIconImg} alt='Logo do Google' />
              Crie sua sala com o Google
            </button>
            <div className='separator'>ou entre em uma sala</div>
            <form onSubmit={handleJoinRoom}>
              <input
                type='text'
                placeholder='Digite o código da sala'
                onChange={event => setRoomCode(event.target.value)}
                value={roomCode}
              />
              <Button type='submit'>Entrar na sala</Button>
            </form>
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
