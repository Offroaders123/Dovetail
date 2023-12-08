import type { NBTTree } from "./NBTTree.js";

declare global {
  interface DataTransferFile extends DataTransferItem {
    readonly kind: "file";
    getAsFile(): File;
    getAsString(callback: null): void;
  }

  interface Navigator {
    /**
     * Exclusive to iOS, iPadOS, and macOS devices.
    */
    readonly standalone: boolean;
  }

  var saver: HTMLButtonElement;
  var fileOpener: HTMLInputElement;
  var formatOpener: HTMLButtonElement;
  var treeViewToggle: HTMLInputElement;
  var editor: HTMLTextAreaElement;
  var treeView: NBTTree;
  var formatDialog: HTMLDialogElement;
  var formatForm: HTMLFormElement & {
    readonly elements: FormatOptionsCollection;
  };
}

interface FormatOptionsCollection extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  disableName: HTMLInputElement;
  endian: RadioNodeList;
  compression: RadioNodeList;
  bedrockLevel: HTMLInputElement;
}

export {};