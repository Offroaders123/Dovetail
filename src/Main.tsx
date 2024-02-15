import { NBTTree } from "./NBTTree.js";
import { Editor } from "./Editor.js";

import type { Dispatch, SetStateAction } from "react";
import type { NBTData, RootName } from "nbtify";

export interface MainProps {
  getRootName: RootName;
  getEditorDisabled: boolean;
  getEditorValue: string;
  setEditorValue: Dispatch<SetStateAction<string>>;
  getShowTreeView: boolean;
  getTreeViewValue: NBTData;
}

export function Main(props: MainProps){
  return (
    <main>
      {
        props.getShowTreeView
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