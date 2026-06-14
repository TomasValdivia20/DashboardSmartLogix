import { createPortal } from 'react-dom'

const modalRoot = document.getElementById('modal-root')

export default function ModalPortal({ children }) {
  return createPortal(children, modalRoot)
}
