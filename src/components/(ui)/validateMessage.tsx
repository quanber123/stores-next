import React from 'react';
type Props = {
  isValidate: boolean;
  message: string;
  customClassName?: string;
  icon?: any;
  iconClassName?: string;
};
const ValidateMessage: React.FC<Props> = ({
  isValidate,
  message,
  customClassName,
  icon,
  iconClassName,
}) => {
  return (
    <div
      className={`${
        customClassName ? customClassName : `absolute -bottom-1/3`
      }`}
    >
      <p
        className={`${
          isValidate ? 'text-green-500 hidden' : 'text-red-500'
        } font-bold text-sm`}
      >
        {message}
      </p>
      {icon && (
        <span
          className={iconClassName}
          dangerouslySetInnerHTML={{ __html: icon }}
        ></span>
      )}
    </div>
  );
};

export default ValidateMessage;
