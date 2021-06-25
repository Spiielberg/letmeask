import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean;
  isCancelButton?: boolean;
  isDangerButton?: boolean;
};

export function Button({
  isOutlined = false,
  isCancelButton = false,
  isDangerButton = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button ${isOutlined && 'outlined'} ${
        isCancelButton && 'cancel'
      } ${isDangerButton && 'danger'}`}
      {...props}
    />
  );
}
