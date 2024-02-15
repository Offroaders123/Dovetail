import icon from "/img/icon.svg";

import type { Dispatch, SetStateAction } from "react";

export interface HeaderProps {
  getEditorDisabled: boolean;
  setEditorDisabled: Dispatch<SetStateAction<boolean>>;
  getEditingSNBT: boolean;
  getShowTreeView: boolean;
  setShowTreeView: Dispatch<SetStateAction<boolean>>;
  setShowFormatDialog: Dispatch<SetStateAction<boolean>>;
  openFile(): void;
  saveFile(): void;
}

export function Header(props: HeaderProps){
  return (
    <header>
      <img draggable="false" src={icon} alt=""/>
      <button
        onClick={() => props.openFile()}
      >Open</button>
      <button
        disabled={props.getEditorDisabled}
        onClick={() => props.saveFile()}
      >Save</button>
      <button
        disabled={props.getEditorDisabled || props.getEditingSNBT}
        onClick={() => props.setShowFormatDialog(showFormatDialog => !showFormatDialog)}
      >Format Options...</button>
      <label style={{ marginInlineStart: "auto" }}>
        <input
          type="checkbox"
          name="treeView"
          checked={props.getShowTreeView}
          onChange={() => props.setShowTreeView(treeView => !treeView)}
        />
        {" Tree View "}
      </label>
    </header>
  );
}