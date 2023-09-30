import React from 'react';
import style from '../spinner.module.css';

export default function LoadingSpinner() {
  return (
    <div className={style.spinnerContainer}>
      <div className={style.loadingSpinner}></div>
    </div>
  );
}
