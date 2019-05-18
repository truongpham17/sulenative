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
};

export const Alert = (title, message, closeLable, submitLabel, onSubmit) => {
  AlertIOS.alert(title || '', message || '', [
    {
      text: closeLable || 'Đóng',
      style: 'cancel'
    },
    {
      text: submitLabel || 'OK',
      onPress: () => onSubmit && onSubmit()
    }
  ]);
};

export const AlertInfo = (title, message, onClose) => {
  AlertIOS.alert(title || '', message || '', [
    {
      text: 'Đóng',
      style: 'cancel',
      onPress: () => onClose && onClose()
    }
  ]);
};
