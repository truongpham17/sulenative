import { AlertIOS } from 'react-native';

export const Promt = (
  title,
  message,
  closeLable,
  submitLabel,
  onSubmit,
  type,
  defaultValue,
  keyboardType
) => {
  setTimeout(() => {
    AlertIOS.prompt(
      title || 'Vui lòng nhập',
      message || '',
      [
        {
          text: closeLable,
          style: 'cancel'
        },
        {
          text: submitLabel,
          onPress: value => onSubmit(value)
        }
      ],
      type || 'plain-text',
      defaultValue || '',
      keyboardType || 'default'
    );
  }, 300);
};

export const Alert = (title, message, closeLable, submitLabel, onSubmit, onCancle) => {
  setTimeout(() => {
    AlertIOS.alert(title || '', message || '', [
      {
        text: closeLable || 'Đóng',
        style: 'cancel',
        onPress: () => onCancle && onCancle()
      },
      {
        text: submitLabel || 'OK',
        onPress: () => onSubmit && onSubmit()
      }
    ]);
  }, 300);
};

export const AlertInfo = (title, message, onClose) => {
  setTimeout(() => {
    AlertIOS.alert(title || '', message || '', [
      {
        text: 'Đóng',
        style: 'cancel',
        onPress: () => onClose && onClose()
      }
    ]);
  }, 300);
};
