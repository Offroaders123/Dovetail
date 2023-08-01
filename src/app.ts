import "./compression-polyfill.js";
import { read, write, parse, stringify, NBTData, Int32 } from "nbtify";

import type { Name, Endian, Compression, BedrockLevel, FormatOptions } from "nbtify";

const platform = navigator.userAgentData?.platform ?? navigator.platform;
const isiOSDevice = /^(Mac|iPhone|iPad|iPod)/i.test(platform) && typeof navigator.standalone === "boolean";

/**
 * The name of the currently opened file.
*/
let name: string;
let fileHandle: FileSystemFileHandle | null = null;

if (window.isSecureContext){
  await navigator.serviceWorker.register("./service-worker.js");
}

window.launchQueue?.setConsumer?.(async launchParams => {
  const { files: handles } = launchParams;
  const [handle] = handles;
  if (handle === undefined) return;

  await openFile(handle);
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

/**
 * Attempts to read an NBT file, then open it in the editor.
*/
export async function openFile(file: File | FileSystemFileHandle | DataTransferFile): Promise<void> {
  saver.disabled = true;
  formatOpener.disabled = true;
  editor.disabled = true;

  if (file instanceof DataTransferItem){
    const handle = await file.getAsFileSystemHandle?.() ?? null;
    file = handle === null || !(handle instanceof FileSystemFileHandle) ? file.getAsFile() : handle;
  }
  if ("getFile" in file){
    fileHandle = file;
    file = await file.getFile();
  } else {
    fileHandle = null;
  }

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
export function openOptions({ name, endian, compression, bedrockLevel }: NBTData): FormatOptions {
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
export function saveOptions(): FormatOptions {
  const { elements } = formatForm;

  const name: Name = (elements.disableName.checked) ? null : elements.name.value;
  const endian: Endian = elements.endian.value as Endian;
  const compression: Compression = (elements.compression.value === "none") ? null : elements.compression.value as CompressionFormat;
  const bedrockLevel: BedrockLevel = (elements.bedrockLevel.value === "") ? null : new Int32(parseInt(elements.bedrockLevel.value));

  return { name, endian, compression, bedrockLevel };
}

/**
 * Saves the file in-place to the file system, or shows the save file picker to the user.
*/
export async function saveFile(file: File): Promise<void> {
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
  return new File([data],name);
}