import { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

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
      className={classNames(
        'button',
        { outlined: isOutlined },
        { cancel: isCancelButton },
        { danger: isDangerButton }
      )}
      {...props}
    />
  );
}
