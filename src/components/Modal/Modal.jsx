import { Component } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalDiv } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  
  componentDidMount() {
    window.addEventListener('keydown', this.handleClickEsc);
  }
 
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleClickEsc);
  }

  handleClickEsc = e => {
    
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };

 
  handleClickBackdrop = e => {
    
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    const { children } = this.props;
    return createPortal(
      <Overlay onClick={this.handleClickBackdrop}>
        <ModalDiv>{children}</ModalDiv>
      </Overlay>,
      modalRoot
    );
  }
}