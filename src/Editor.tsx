import type { Dispatch, SetStateAction } from "react";

export interface EditorProps {
  disabled: boolean;
  getValue: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export function Editor(props: EditorProps){
  return (
    <textarea
      name="editor"
      disabled={props.disabled}
      placeholder="NBT data will show here..."
      wrap="off"
      spellCheck={false}
      autoComplete="off"
      autoCapitalize="none"
      autoCorrect="off"
      value={props.getValue}
      onChange={event => props.setValue(event.currentTarget.value)}
    />
  );
}