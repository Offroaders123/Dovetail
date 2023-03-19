import "./compression-polyfill.js";
import { read, write, parse, stringify, NBTData, NBTDataOptions } from "nbtify";

if (window.isSecureContext){
  await navigator.serviceWorker.register("./service-worker.js");
}

const saver = document.querySelector<HTMLButtonElement>("#saver")!;
const fileOpener = document.querySelector<HTMLInputElement>("#fileOpener")!;
const formatOpener = document.querySelector<HTMLButtonElement>("#formatOpener")!;
const editor = document.querySelector<HTMLTextAreaElement>("#editor")!;
const formatDialog = document.querySelector<HTMLDialogElement>("#formatDialog")!;
const formatForm = document.querySelector<HTMLFormElement>("#formatForm")!;

let config: NBTDataOptions;
let name: string;

document.addEventListener("dragover",event => {
  event.preventDefault();
  if (event.dataTransfer === null) return;

  event.dataTransfer.dropEffect = "copy";
});

document.addEventListener("drop",async event => {
  event.preventDefault();
  if (event.dataTransfer === null) return;

  const items = [...event.dataTransfer.items].filter(item => item.kind === "file");
  if (items.length === 0) return;

  const [item] = items;
  const file = item.getAsFile()!;
  await openFile(file);
});

saver.addEventListener("click",async () => {
  const snbt = editor.value;
  const nbt = new NBTData(parse(snbt),config);
  const file = await writeFile(nbt);

  const isiOSDevice = (
    /^(Mac|iPhone|iPad|iPod)/i.test(navigator.userAgentData?.platform ?? navigator.platform) &&
    typeof navigator.standalone === "boolean"
  );

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

export async function openFile(file: File){
  saver.disabled = true;
  formatOpener.disabled = true;
  editor.disabled = true;

  const nbt = await readFile(file);
  if (nbt === null) return;

  const snbt = stringify(nbt,{ space: 2 });
  config = nbt;
  name = file.name;

  document.title = `Dovetail - ${name}`;

  saver.disabled = false;
  formatOpener.disabled = false;
  editor.value = snbt;
  editor.disabled = false;
}

export async function readFile(file: File){
  try {
    const buffer = await file.arrayBuffer();
    const nbt = await read(buffer);
    return nbt;
  } catch (error){
    alert(error);
    return null;
  }
}

export function saveFile(file: File){
  const anchor = document.createElement("a");
  const blob = URL.createObjectURL(file);

  anchor.href = blob;
  anchor.download = file.name;
  anchor.click();

  URL.revokeObjectURL(blob);
}

export async function shareFile(file: File){
  try {
    await navigator.share({ files: [file] });
  } catch (error){
    console.warn(error);
  }
}

export async function writeFile(nbt: NBTData){
  const data = await write(nbt);
  const file = new File([data],name);
  return file;
}