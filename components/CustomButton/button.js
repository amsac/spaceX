import React from 'react';
import styles from '../../styles/CustomButton.module.css';
function Button(props) {
  const { buttonText, status, handleClick, key, toUpdate } = props;
 
  const buttonActive = status ? "active" : ""
  return (
    <button key={key} className={buttonActive == 'active' ?  styles.btn-active:styles.btn}
    onClick={() => { handleClick(toUpdate,buttonText) }}>{buttonText}</button>
  );
}

export default React.memo(Button);
