import React from 'react';

const Modal = ({ id, title, children, onClose }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{children}</div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={onClose}>Close</button>
          </form>
        </div>
      </div>
       <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default Modal;
