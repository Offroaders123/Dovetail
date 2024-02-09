import { NBTTree } from "./NBTTree.js";
import { Editor } from "./Editor.js";

import type { Accessor, Setter } from "solid-js";
import type { NBTData, RootName } from "nbtify";

export interface MainProps {
  getRootName: Accessor<RootName>;
  getEditorDisabled: Accessor<boolean>;
  getEditorValue: Accessor<string>;
  setEditorValue: Setter<string>;
  getShowTreeView: Accessor<boolean>;
  getTreeViewValue: Accessor<NBTData>;
}

export function Main(props: MainProps){
  return (
    <main>
      {
        props.getShowTreeView()
          ? <NBTTree name={props.getRootName} value={props.getTreeViewValue}/>
          : <Editor
              disabled={props.getEditorDisabled}
              getValue={props.getEditorValue}
              setValue={props.setEditorValue}
            />
      }
    </main>
  );
}