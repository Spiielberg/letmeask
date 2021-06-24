import toast, { Toaster } from 'react-hot-toast';

import { toastConfig } from '../config/toastConfig';

import copyImg from '../assets/images/copy.svg';

import '../styles/room-code.scss';

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code }: RoomCodeProps) {
  function handleCopyRoomCodeToClipboard() {
    navigator.clipboard.writeText(code);

    toast('Código da sala copiado.', toastConfig);
  }

  return (
    <>
      <button className='room-code' onClick={handleCopyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt='Copiar código da sala' />
        </div>
        <span>{code}</span>
      </button>
      <Toaster />
    </>
  );
}
