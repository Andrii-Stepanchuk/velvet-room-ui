import { useCallback, useState } from 'react';

export function useNameEntry(onSubmit: (name: string) => void) {
  const [value, setValue] = useState('');
  const name = value.trim();
  const canSubmit = name.length > 0;
  const submit = useCallback(() => onSubmit(name), [name, onSubmit]);

  return { value, setValue, name, canSubmit, submit };
}
