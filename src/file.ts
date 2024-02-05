import { read, write, parse, stringify, NBTData } from "nbtify";
import manifestURL from "/manifest.webmanifest?url";

import type { ReadOptions } from "nbtify";

console.clear();

interface WebAppManifest {
  file_handlers: FileHandler[];
}

interface FileHandler {
  action: string;
  accept: FileHandlerAccept;
}

type FileHandlerAccept = Record<string, string[]>;

const manifest: WebAppManifest = await fetch(manifestURL)
  .then(response => response.json());
// console.log(JSON.stringify(manifest,null,2));

const { file_handlers } = manifest;
console.log(JSON.stringify(file_handlers,null,2));

const accept: string = file_handlers.map(handler => Object.entries(handler.accept)).flat(3).join(", ");
console.log(accept);

const acceptOld = "application/octet-stream, .nbt, .dat, .dat_old, .mcstructure, .litematic, .schem, .schematic, .snbt";
console.log(acceptOld);

console.log(accept === acceptOld);

/**
 * Attempts to read an NBT file, then open it in the editor.
*/
export async function openFile(file: File | FileSystemFileHandle | DataTransferFile | null = null): Promise<File | FileSystemFileHandle | null> {
  if (file === null){
      const fileOpener = document.createElement("input");
      fileOpener.type = "file";
      fileOpener.accept = accept;

      await new Promise<void>(resolve => {
        fileOpener.addEventListener("change",() => resolve(),{ once: true });
        fileOpener.addEventListener("cancel",() => resolve(),{ once: true });
        fileOpener.click();
      });

      file = fileOpener.files?.[0] ?? null;
    }

  if (file instanceof DataTransferItem){
    const handle: FileSystemHandle | null = await file.getAsFileSystemHandle?.() ?? null;
    file = handle instanceof FileSystemFileHandle ? handle : file.getAsFile();
  }

  return file;
}

/**
 * Attempts to create an NBTData object from a File object.
*/
export async function readFile(file: File, options?: ReadOptions): Promise<NBTData> {
  // May want to dedupe
  if (file.name.endsWith(".snbt")){
    const text = await file.text();
    return new NBTData(parse(text));
  }

  const buffer = await file.arrayBuffer();
  return read(buffer,options);
}

/**
 * Saves the file in-place to the file system, or shows the save file picker to the user.
*/
export async function saveFile(file: File, fileHandle: FileSystemFileHandle | null): Promise<void> {
  if (fileHandle !== null){
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();
    return;
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
export async function writeFile(nbt: NBTData, name: string): Promise<File> {
  // May want to dedupe
  if (name.endsWith(".snbt")){
    const text = stringify(nbt);
    return new File([text],name);
  }

  const data = await write(nbt);
  return new File([data],name);
}