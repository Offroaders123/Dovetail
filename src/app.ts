import "./compression-polyfill.js";
import { read, write, parse, stringify, NBTData } from "https://cdn.jsdelivr.net/npm/nbtify@1.20.1/dist/index.js";

if (window.isSecureContext){
  await navigator.serviceWorker.register("./service-worker.js");
}

const saver = document.querySelector<HTMLButtonElement>("#saver")!;
const opener = document.querySelector<HTMLInputElement>("#opener")!;
const editor = document.querySelector<HTMLTextAreaElement>("#editor")!;

let config: NBTData;

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
  saveFile(file);
});

opener.addEventListener("change",async () => {
  if (opener.files === null) return;
  if (opener.files.length === 0) return;

  const [file] = opener.files;
  await openFile(file);
});

export async function openFile(file: File){
  saver.disabled = true;
  editor.disabled = true;

  const nbt = await readFile(file);
  if (nbt === null){
    return;
  }

  const snbt = stringify(nbt,{ space: 2 });
  config = nbt;
  name = file.name;
  saver.disabled = false;
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

export async function writeFile(nbt: NBTData){
  const data = await write(nbt);
  const file = new File([data],name);
  return file;
}