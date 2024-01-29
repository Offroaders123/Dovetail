import { read, write } from "nbtify";
// import manifestImported from "/manifest.webmanifest" assert { type: "json" };
import manifestURL from "/manifest.webmanifest";

import type { NBTData, ReadOptions } from "nbtify";

type Manifest = {
  file_handlers: {
    action: string;
    accept: {
      [mimeType: string]: string[];
    };
  }[];
}

const manifest: Manifest = await fetch(manifestURL).then(response => response.json());
console.log(manifest.file_handlers);

/**
 * Attempts to read an NBT file, then open it in the editor.
*/
export async function openFile(file: File | FileSystemFileHandle | DataTransferFile | null = null): Promise<File | FileSystemFileHandle | null> {
  if (file === null){
    if ("showOpenFilePicker" in window){
      const [fileHandle] = await window.showOpenFilePicker({
        types: manifest.file_handlers
      })/*
      }).catch(() => ([]));
*/
      file = fileHandle ?? null;
    } else {
      const fileOpener = document.createElement("input");
      fileOpener.type = "file";
      // Same with this one, I want to dedupe these, now that I am using a bundler.
      fileOpener.accept = "application/octet-stream, .nbt, .dat, .dat_old, .mcstructure, .litematic, .schem, .schematic";

      await new Promise(resolve => {
        fileOpener.addEventListener("change",resolve,{ once: true });
        fileOpener.click();
      });

      file = fileOpener.files?.[0] ?? null;
    }
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
  const data = await write(nbt);
  return new File([data],name);
}