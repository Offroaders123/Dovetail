import type { Accessor, Setter } from "solid-js";

export interface EditorProps {
  disabled: Accessor<boolean>;
  getValue: Accessor<string>;
  setValue: Setter<string>;
}

export function Editor(props: EditorProps){
  return (
    <textarea
      name="editor"
      disabled={props.disabled()}
      placeholder="NBT data will show here..."
      wrap="off"
      spellcheck={false}
      autocomplete="off"
      autocapitalize="none"
      autocorrect="off"
      value={props.getValue()}
      oninput={event => props.setValue(event.currentTarget.value)}
    />
  );
}