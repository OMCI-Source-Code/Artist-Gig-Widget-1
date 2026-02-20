import React from 'react'
import '../styles/modal.css'

function Modal({children, closeModal}) {
      return (
            <div className="modalBackground">
                  <div className="modalContainer">
                        <div className="closeModalBtn">
                        <button  onClick={() => {closeModal(false)}}> X </button>
                        </div>
                        {children}
                  </div>
            </div>

      )
}

export default Modal