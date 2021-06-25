import ReactModal from 'react-modal';

import dangerImg from '../assets/images/danger.svg';

import { Button } from './Button';

import '../styles/modal.scss';

ReactModal.setAppElement('#root');

type ModalProps = {
  id: string | undefined;
  onConfirm: (id: string | undefined) => void;
  onCancel: () => void;
};

export function Modal({ id, onConfirm, onCancel }: ModalProps) {
  return (
    <ReactModal
      className='modal-content'
      overlayClassName='overlay-modal'
      isOpen={!!id}
      onRequestClose={onCancel}
    >
      <img src={dangerImg} alt='Círculo com um X' />
      <h1>Excluir pergunta</h1>
      <p>Tem certeza que você deseja excluir esta pergunta?</p>

      <div>
        <Button isCancelButton type='button' onClick={onCancel}>
          Cancelar
        </Button>
        <Button isDangerButton type='button' onClick={() => onConfirm(id)}>
          Sim, excluir
        </Button>
      </div>
    </ReactModal>
  );
}
