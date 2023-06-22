import "./compression-polyfill.js";
import { read, write, parse, stringify, NBTData, Int32 } from "nbtify";
import type { Name, Endian, Compression, BedrockLevel, NBTDataOptions, RootTag } from "nbtify";

const platform = navigator.userAgentData?.platform ?? navigator.platform;
const isiOSDevice = /^(Mac|iPhone|iPad|iPod)/i.test(platform) && typeof navigator.standalone === "boolean";

const saver = document.querySelector<HTMLButtonElement>("#saver")!;
const fileOpener = document.querySelector<HTMLInputElement>("#fileOpener")!;
const formatOpener = document.querySelector<HTMLButtonElement>("#formatOpener")!;
const editor = document.querySelector<HTMLTextAreaElement>("#editor")!;
const formatDialog = document.querySelector<HTMLDialogElement>("#formatDialog")!;
const formatForm = document.querySelector<HTMLFormElement & { readonly elements: FormatOptionsCollection; }>("#formatForm")!;

export interface FormatOptionsCollection extends HTMLFormControlsCollection {
  name: HTMLInputElement;
  disableName: HTMLInputElement;
  endian: RadioNodeList;
  compression: RadioNodeList;
  bedrockLevel: HTMLInputElement;
}

/**
 * The name of the currently opened file.
*/
let name: string;

if (window.isSecureContext){
  await navigator.serviceWorker.register("./service-worker.js");
}

window.launchQueue?.setConsumer?.(async launchParams => {
  const { files: handles } = launchParams;
  if (handles.length === 0) return;

  const [handle] = handles;
  const file = await handle.getFile();
  await openFile(file);
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
    .filter((item): item is Omit<DataTransferItem,"getAsFile"> & { getAsFile(): File; } => item.kind === "file");
  if (items.length === 0) return;

  const [item] = items;
  const file = item.getAsFile();
  await openFile(file);
});

saver.addEventListener("click",async () => {
  const snbt = editor.value;
  const nbt = parse(snbt);
  const options = saveOptions();
  const nbtData = new NBTData(nbt,options);
  const file = await writeFile(nbtData);

  if (isiOSDevice && window.isSecureContext){
    await shareFile(file);
  } else {
    saveFile(file);
  }
});

fileOpener.addEventListener("change",async () => {
  if (fileOpener.files === null) return;
  if (fileOpener.files.length === 0) return;

  const [file] = fileOpener.files;
  await openFile(file);
});

formatOpener.addEventListener("click",() => {
  formatDialog.showModal();
});

/**
 * Attempts to read an NBT file, then open it in the editor.
*/
export async function openFile(file: File): Promise<void> {
  saver.disabled = true;
  formatOpener.disabled = true;
  editor.disabled = true;

  const nbt = await readFile(file);
  if (nbt === null) return;

  const snbt = stringify(nbt,{ space: 2 });
  openOptions(nbt);
  name = file.name;

  document.title = `Dovetail - ${name}`;

  saver.disabled = false;
  formatOpener.disabled = false;
  editor.value = snbt;
  editor.disabled = false;
}

/**
 * Updates the Format Options dialog to match the NBT file's metadata.
*/
export function openOptions({ name, endian, compression, bedrockLevel }: NBTData): NBTDataOptions {
  const { elements } = formatForm;

  if (name !== null){
    elements.name.value = name;
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

  return { name, endian, compression, bedrockLevel };
}

/**
 * Attempts to create an NBTData object from a File object.
*/
export async function readFile<T extends RootTag = any>(file: File): Promise<NBTData<T> | null> {
  const buffer = await file.arrayBuffer();
  try {
    return await read(buffer);
  } catch (error: unknown){
    if (error instanceof Error && error.message.includes("unread bytes remaining")){
      const reattempt = confirm(`${error}\n\nEncountered extra data at the end of the file. Would you like to try opening it again without 'strict mode' enabled? The trailing data will be lost when re-saving your file again.`);
      if (!reattempt) return null;
      return read<T>(buffer,{ strict: false });
    } else {
      alert(error);
      return null;  
    }
  }
}

/**
 * Turns the values from the Format Options dialog into the NBT file's metadata.
*/
export function saveOptions(): NBTDataOptions {
  const { elements } = formatForm;

  const name: Name = (elements.disableName.checked) ? null : elements.name.value;
  const endian: Endian = elements.endian.value as Endian;
  const compression: Compression = (elements.compression.value === "none") ? null : elements.compression.value as CompressionFormat;
  const bedrockLevel: BedrockLevel = (elements.bedrockLevel.value === "") ? null : new Int32(parseInt(elements.bedrockLevel.value));

  return { name, endian, compression, bedrockLevel };
}

/**
 * Shows the save file picker to the user.
*/
export function saveFile(file: File): void {
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
  return new File([data],name);
}