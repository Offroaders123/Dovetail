import "./compression-polyfill.js";
import * as NBT from "https://cdn.jsdelivr.net/npm/nbtify@1.20.1/dist/index.js";

if (window.isSecureContext){
  await navigator.serviceWorker.register("./service-worker.js");
}

console.log(NBT);

const saver = /** @type { HTMLButtonElement } */ (document.querySelector("#saver"));
const opener = /** @type { HTMLInputElement } */ (document.querySelector("#opener"));
const editor = /** @type { HTMLTextAreaElement } */ (document.querySelector("#editor"));

/** @type { NBT.NBTData } */
let config;

/** @type { string } */
let name;

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
  const file = /** @type { File } */ (item.getAsFile());
  await openFile(file);
});

saver.addEventListener("click",async () => {
  const snbt = editor.value;
  const nbt = new NBT.NBTData(NBT.parse(snbt),config);
  const file = await writeFile(nbt);
  saveFile(file);
});

opener.addEventListener("change",async () => {
  if (opener.files === null) return;
  if (opener.files.length === 0) return;

  const [file] = opener.files;
  await openFile(file);
});

/**
 * @param { File } file
*/
export async function openFile(file){
  saver.disabled = true;
  editor.disabled = true;

  const nbt = await readFile(file);
  if (nbt === null){
    return;
  }

  const snbt = NBT.stringify(nbt,{ space: 2 });
  config = nbt;
  name = file.name;
  saver.disabled = false;
  editor.value = snbt;
  editor.disabled = false;
}

/**
 * @param { File } file
*/
export async function readFile(file){
  try {
    const buffer = await file.arrayBuffer();
    const nbt = await NBT.read(buffer);
    return nbt;
  } catch (error){
    alert(error);
    return null;
  }
}

/**
 * @param { File } file
*/
export function saveFile(file){
  const anchor = document.createElement("a");
  const blob = URL.createObjectURL(file);
  anchor.href = blob;
  anchor.download = file.name;
  anchor.click();
  URL.revokeObjectURL(blob);
}

/**
 * @param { NBT.NBTData } nbt
*/
export async function writeFile(nbt){
  const data = await NBT.write(nbt);
  const file = new File([data],name);
  return file;
}