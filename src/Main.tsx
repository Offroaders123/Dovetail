import { NBTTree } from "./NBTTree.js";

import type { Accessor, Setter } from "solid-js";
import type { NBTData } from "nbtify";

export interface MainProps {
  getEditorDisabled: Accessor<boolean>;
  getEditorValue: Accessor<string>;
  setEditorValue: Setter<string>;
  getShowTreeView: Accessor<boolean>;
  getTreeViewValue: Accessor<NBTData | null>;
}

export function Main(props: MainProps){
  return (
    <main>
      {
        props.getShowTreeView()
          ? <NBTTree value={props.getTreeViewValue}/>
          : <textarea
              disabled={props.getEditorDisabled()}
              placeholder="NBT data will show here..."
              wrap="off"
              spellcheck={false}
              autocomplete="off"
              autocapitalize="none"
              autocorrect="off"
              value={props.getEditorValue()}
              oninput={event => props.setEditorValue(event.currentTarget.value)}
            />
      }
    </main>
  );
}