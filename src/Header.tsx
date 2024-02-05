import icon from "/img/icon.svg";

import type { Accessor, Setter } from "solid-js";

export interface HeaderProps {
  getEditorDisabled: Accessor<boolean>;
  setEditorDisabled: Setter<boolean>;
  getEditingSNBT: Accessor<boolean>;
  getShowTreeView: Accessor<boolean>;
  setShowTreeView: Setter<boolean>;
  setShowFormatDialog: Setter<boolean>;
  openFile(): void;
  saveFile(): void;
}

export function Header(props: HeaderProps){
  return (
    <header>
      <img draggable="false" src={icon} alt=""/>
      <button
        onclick={() => props.openFile()}
      >Open</button>
      <button
        disabled={props.getEditorDisabled()}
        onclick={() => props.saveFile()}
      >Save</button>
      <button
        disabled={props.getEditorDisabled() || props.getEditingSNBT()}
        onclick={() => props.setShowFormatDialog(showFormatDialog => !showFormatDialog)}
      >Format Options...</button>
      <label style="margin-inline-start: auto;">
        <input
          type="checkbox"
          name="treeView"
          checked={props.getShowTreeView()}
          oninput={() => props.setShowTreeView(treeView => !treeView)}
        />
        {" Tree View "}
      </label>
    </header>
  );
}