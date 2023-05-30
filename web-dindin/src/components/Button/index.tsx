import { FormEvent } from 'react';
import './styles.scss';

type ButtonProps = {
  text: string;
  onClick?: (e: FormEvent) => void;
};

export default function Button({ text, onClick }:ButtonProps) {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}