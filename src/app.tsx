import "./compression-polyfill.js";
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { parse, stringify, NBTData } from "nbtify";
import { openFile, readFile, saveFile, shareFile, writeFile } from "./file.js";
import { Header } from "./Header.js";
import { Main } from "./Main.js";
import { FormatOptions } from "./FormatOptions.js";
import "./index.scss";

import type { RootName, Endian, Compression, BedrockLevel, Format } from "nbtify";

// global state
const [getShowTreeView,setShowTreeView] = createSignal<boolean>(true);
const [getTreeViewValue,setTreeViewValue] = createSignal<NBTData | null>(null);
/** The name of the currently opened file. */
const [getName,setName] = createSignal<string>("");
const [getFileHandle,setFileHandle] = createSignal<FileSystemFileHandle | null>(null);
const [getEditorValue,setEditorValue] = createSignal<string>("");
const [getEditorDisabled,setEditorDisabled] = createSignal<boolean>(true);
const [getRootName,setRootName] = createSignal<RootName>("");
const [getEndian,setEndian] = createSignal<Endian>("big");
const [getCompression,setCompression] = createSignal<Compression>(null);
const [getBedrockLevel,setBedrockLevel] = createSignal<BedrockLevel>(null);
/**
 * Turns the values from the Format Options dialog into the NBT file's metadata.
*/
const getFormat = (): Format => ({
  rootName: getRootName(),
  endian: getEndian(),
  compression: getCompression(),
  bedrockLevel: getBedrockLevel()
});
/**
 * Updates the Format Options dialog to match an NBT file's format metadata.
*/
const setFormat = (format: Format): Format => {
  const { rootName, endian, compression, bedrockLevel } = format;
  setRootName(rootName);
  setEndian(endian);
  setCompression(compression);
  setBedrockLevel(bedrockLevel);
  return format;
}

// refs
// let saver: HTMLButtonElement;
// let fileOpener: HTMLInputElement;
// let formatDialog: HTMLDialogElement;

// Temporarily placed here, incrementally moving to JSX
export function App(){
  const [getFormatDialog,setFormatDialog] = createSignal<HTMLDialogElement | null>(null);

  return (
    <>

    <Header
      getEditorDisabled={getEditorDisabled}
      setEditorDisabled={setEditorDisabled}
      getShowTreeView={getShowTreeView}
      setShowTreeView={setShowTreeView}
      openFile={async () => await openNBTFile()}
      saveFile={async () => await saveNBTFile()}
      showFormatDialog={() => getFormatDialog()?.showModal()}
    />

    <Main getEditorDisabled={getEditorDisabled} getEditorValue={getEditorValue} setEditorValue={setEditorValue} getShowTreeView={getShowTreeView} getTreeViewValue={getTreeViewValue}/>

    <FormatOptions
        getRootName={getRootName}
        setRootName={setRootName}
        getEndian={getEndian}
        setEndian={setEndian}
        getCompression={getCompression}
        setCompression={setCompression}
        getBedrockLevel={getBedrockLevel}
        setBedrockLevel={setBedrockLevel}
        setFormatDialog={setFormatDialog}
      />

    </>
  );
}

render(App,document.querySelector<HTMLDivElement>("#root")!);

const platform: string = navigator.userAgentData?.platform ?? navigator.platform;
const appleDevice: boolean = /^(Mac|iPhone|iPad|iPod)/i.test(platform);
const isiOSDevice: boolean = appleDevice && navigator.maxTouchPoints > 1;

if (window.isSecureContext && !import.meta.env.DEV){
  await navigator.serviceWorker.register("./service-worker.js");
}

window.launchQueue?.setConsumer?.(async launchParams => {
  const { files: handles } = launchParams;
  const [handle] = handles;
  if (handle === undefined) return;

  await openNBTFile(handle);
});

enum Shortcut {
  Open = "ControlOrCommand+O",
  Save = "ControlOrCommand+S"
}

document.addEventListener("keydown",async event => {
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
    case Shortcut.Open: return await openNBTFile();
    case Shortcut.Save: return await saveNBTFile();
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

  await openNBTFile(item);
});

const demo = fetch("./bigtest.nbt")
  .then(response => response.blob())
  .then(blob => new File([blob],"bigtest.nbt"));
demo.then(console.log);
demo.then(openNBTFile);

/**
 * Opens an NBT file in the editor.
*/
export async function openNBTFile(file: File | FileSystemFileHandle | DataTransferFile | null = null): Promise<void> {
  setEditorDisabled(true);

  file = await openFile(file);
  if (file === null) return;

  if ("getFile" in file){
    setFileHandle(file);
    file = await file.getFile();
  } else {
    setFileHandle(null);
  }

  let nbt: NBTData;

  try {
    nbt = await readFile(file);
  } catch (error: unknown){
    if (error instanceof Error && error.message.includes("unread bytes remaining")){
      const reattempt = confirm(`${error}\n\nEncountered extra data at the end of '${file.name}'. Would you like to try opening it again without 'strict mode' enabled? The trailing data will be lost when re-saving your file again.`);
      if (!reattempt) return;
      nbt = await readFile(file,{ strict: false });
    } else {
      alert(`Could not read '${file.name}' as NBT data.\n\n${error}`);
      return;
    }
  }

  const snbt = stringify(nbt,{ space: 2 });
  setFormat(nbt);
  setName(file.name);

  document.title = `Dovetail - ${getName()}`;

  setEditorValue(snbt);
  setEditorDisabled(false);
  setTreeViewValue(nbt);
}

/**
 * Saves the current NBT file from the editor.
*/
export async function saveNBTFile(file: File | null = null): Promise<void> {
  if (file === null){
    try {
      const snbt = getEditorValue();
      const nbt = parse(snbt);
      const options = getFormat();
      const nbtData = new NBTData(nbt,options);
      file = await writeFile(nbtData,getName());

      if (isiOSDevice && window.isSecureContext){
        return await shareFile(file);
      }
    } catch (error: unknown){
      alert(`Could not save '${getName()}' as NBT data.\n\n${error}`);
      return;
    }
  }

  return saveFile(file,getFileHandle());
}