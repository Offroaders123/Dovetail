import "./compression-polyfill.js";
import { createEffect, createSignal } from "solid-js";
import { render } from "solid-js/web";
import { NBTTree } from "./NBTTree.js";
import { read, write, parse, stringify, NBTData } from "nbtify";

import type { RootName, Endian, Compression, BedrockLevel, Format } from "nbtify";

// global state
const [getShowTreeView,setShowTreeView] = createSignal<boolean>(true);
const [getTreeViewValue,setTreeViewValue] = createSignal<NBTData | null>(null);
/** The name of the currently opened file. */
const [getName,setName] = createSignal<string>("");
const [getFileHandle,setFileHandle] = createSignal<FileSystemFileHandle | null>(null);

// refs
const saver = document.querySelector<HTMLButtonElement>("#saver")!;
const fileOpener = document.querySelector<HTMLInputElement>("#fileOpener")!;
const formatOpener = document.querySelector<HTMLButtonElement>("#formatOpener")!;
const treeViewToggle = document.querySelector<HTMLInputElement>("#treeViewToggle")!;
const editor = document.querySelector<HTMLTextAreaElement>("#editor")!;
/* const treeView = */
const formatDialog = document.querySelector<HTMLDialogElement>("#formatDialog")!;
const formatForm = document.querySelector<HTMLFormElement>("#formatForm")! as HTMLFormElement & {
  readonly elements: FormatOptionsCollection;
};

// Temporarily placed here, incrementally moving to JSX
export function App(){
  createEffect(() => {
    if (getShowTreeView()){
      editor.style.display = "none";
    } else {
      editor.style.removeProperty("display");
    }
  });

  return (
    <>{
      getShowTreeView() &&
        <NBTTree value={getTreeViewValue}/>
    }</>
  );
}

render(App,document.querySelector<HTMLDivElement>("#root")!);

interface FormatOptionsCollection extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  disableName: HTMLInputElement;
  endian: RadioNodeList;
  compression: RadioNodeList;
  bedrockLevel: HTMLInputElement;
}

const platform: string = navigator.userAgentData?.platform ?? navigator.platform;
const appleDevice: boolean = /^(Mac|iPhone|iPad|iPod)/i.test(platform);
const isiOSDevice: boolean = appleDevice && navigator.maxTouchPoints > 1;

if (window.isSecureContext && !import.meta.env.DEV){
  await navigator.serviceWorker.register("./service-worker.js");
}

treeViewToggle.checked = getShowTreeView();

window.launchQueue?.setConsumer?.(async launchParams => {
  const { files: handles } = launchParams;
  const [handle] = handles;
  if (handle === undefined) return;

  await openFile(handle);
});

enum Shortcut {
  Open = "ControlOrCommand+O",
  Save = "ControlOrCommand+S"
}

document.addEventListener("keydown",event => {
  let keys: Set<string> = new Set();
  if (event.ctrlKey || event.metaKey) keys.add("ControlOrCommand");
  if (event.altKey) keys.add("Alt");
  if (event.shiftKey) keys.add("Shift");
  if (event.key !== "Control" && event.key !== "Meta") keys.add(event.key.length === 1 ? event.key.toUpperCase() : event.key);

  const combo: string = [...keys].join("+");
  const isCombo: boolean = Object.values(Shortcut).some(shortcut => shortcut === combo);

  if (!isCombo) return;
  event.preventDefault();
  if (event.repeat) return;

  switch (combo as Shortcut){
    case Shortcut.Open: return fileOpener.click();
    case Shortcut.Save: return saver.click();
  }
});

document.addEventListener("dragover",event => {
  event.preventDefault();
  if (event.dataTransfer === null) return;

  event.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop",async event => {
  event.preventDefault();
  if (event.dataTransfer === null) return;

  const items = [...event.dataTransfer.items]
    .filter((item): item is DataTransferFile => item.kind === "file");
  const [item] = items;
  if (item === undefined) return;

  await openFile(item);
});

saver.addEventListener("click",async () => {
  try {
    const snbt = editor.value;
    const nbt = parse(snbt);
    const options = saveOptions();
    const nbtData = new NBTData(nbt,options);
    const file = await writeFile(nbtData);
  
    if (isiOSDevice && window.isSecureContext){
      await shareFile(file);
    } else {
      await saveFile(file);
    }
  } catch (error: unknown){
    alert(`Could not save '${getName()}' as NBT data.\n\n${error}`);
  }
});

fileOpener.addEventListener("change",async () => {
  const { files } = fileOpener;
  if (files === null) return;
  const [file] = files;
  if (file === undefined) return;

  await openFile(file);
});

formatOpener.addEventListener("click",() => {
  formatDialog.showModal();
});

treeViewToggle.addEventListener("change",() => {
  setShowTreeView(!getShowTreeView());
});

const demo = fetch("./bigtest.nbt")
  .then(response => response.blob())
  .then(blob => new File([blob],"bigtest.nbt"));
demo.then(console.log);
demo.then(openFile);

/**
 * Attempts to read an NBT file, then open it in the editor.
*/
export async function openFile(file: File | FileSystemFileHandle | DataTransferFile): Promise<void> {
  saver.disabled = true;
  formatOpener.disabled = true;
  editor.disabled = true;

  if (file instanceof DataTransferItem){
    const handle: FileSystemHandle | null = await file.getAsFileSystemHandle?.() ?? null;
    file = handle instanceof FileSystemFileHandle ? handle : file.getAsFile();
  }
  if ("getFile" in file){
    setFileHandle(file);
    file = await file.getFile();
  } else {
    setFileHandle(null);
  }

  const nbt = await readFile(file);
  if (nbt === null) return;

  const snbt = stringify(nbt,{ space: 2 });
  openOptions(nbt);
  setName(file.name);

  document.title = `Dovetail - ${getName()}`;

  saver.disabled = false;
  formatOpener.disabled = false;
  editor.value = snbt;
  editor.disabled = false;
  setTreeViewValue(nbt);
}

/**
 * Updates the Format Options dialog to match an NBT file's format metadata.
*/
export function openOptions(format: Format): Format;
export function openOptions({ rootName, endian, compression, bedrockLevel }: Format): Format {
  const { elements } = formatForm;

  if (rootName !== null){
    elements.name.value = rootName;
    elements.name.disabled = false;
    elements.disableName.checked = false;
  } else {
    elements.name.value = "";
    elements.name.disabled = true;
    elements.disableName.checked = true;
  }
  elements.endian.value = endian;
  elements.compression.value = (compression === null) ? "none" : compression;
  elements.bedrockLevel.value = (bedrockLevel === null) ? "" : `${bedrockLevel}`;

  return { rootName, endian, compression, bedrockLevel };
}

/**
 * Attempts to create an NBTData object from a File object.
*/
export async function readFile(file: File): Promise<NBTData | null> {
  const buffer = await file.arrayBuffer();
  try {
    return await read(buffer);
  } catch (error: unknown){
    if (error instanceof Error && error.message.includes("unread bytes remaining")){
      const reattempt = confirm(`${error}\n\nEncountered extra data at the end of '${file.name}'. Would you like to try opening it again without 'strict mode' enabled? The trailing data will be lost when re-saving your file again.`);
      if (!reattempt) return null;
      return read(buffer,{ strict: false });
    } else {
      alert(`Could not read '${file.name}' as NBT data.\n\n${error}`);
      return null;
    }
  }
}

/**
 * Turns the values from the Format Options dialog into the NBT file's metadata.
*/
export function saveOptions(): Format {
  const { elements } = formatForm;

  const rootName: RootName = (elements.disableName.checked) ? null : elements.name.value;
  const endian: Endian = elements.endian.value as Endian;
  const compression: Compression = (elements.compression.value === "none") ? null : elements.compression.value as CompressionFormat;
  const bedrockLevel: BedrockLevel = (elements.bedrockLevel.value === "") ? null : parseInt(elements.bedrockLevel.value);

  return { rootName, endian, compression, bedrockLevel };
}

/**
 * Saves the file in-place to the file system, or shows the save file picker to the user.
*/
export async function saveFile(file: File): Promise<void> {
  const fileHandle = getFileHandle();
  if (fileHandle !== null){
    try {
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();
      return;
    } catch {
      const saveManually = confirm(`'${file.name}' could not be saved in-place. Would you like to try saving it manually? It may go directly to your Downloads folder.`);
      if (!saveManually) return;
    }
  }

  const anchor = document.createElement("a");
  const blob = URL.createObjectURL(file);

  anchor.href = blob;
  anchor.download = file.name;
  anchor.click();

  URL.revokeObjectURL(blob);
}

/**
 * Shows the file share menu to the user.
*/
export async function shareFile(file: File): Promise<void> {
  try {
    await navigator.share({ files: [file] });
  } catch (error){
    console.warn(error);
  }
}

/**
 * Creates a File object from an NBTData object.
*/
export async function writeFile(nbt: NBTData): Promise<File> {
  const data = await write(nbt);
  return new File([data],getName());
}