import { CodeMirror } from "@solid-codemirror/codemirror";

import type { Accessor, Setter } from "solid-js";

export interface EditorProps {
  disabled: Accessor<boolean>;
  getValue: Accessor<string>;
  setValue: Setter<string>;
}

export function Editor(props: EditorProps){
  return (
    <CodeMirror
      aria-name="editor"
      aria-disabled={props.disabled()}
      aria-placeholder="NBT data will show here..."
      wrapLine={false}
      spellcheck={false}
      aria-autocomplete="none"
      autocapitalize="none"
      aria-autocorrect="off"
      value={props.getValue()}
      onValueChange={value => props.setValue(value)}
    />
  );
}