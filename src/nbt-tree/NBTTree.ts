import { NBTData, TAG, getTagType } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

import type { RootTag, CompoundTag } from "nbtify";

export class NBTTree extends HTMLElement {
  #value: RootTag | null = null;
  #root!: NBTBranch;

  constructor() {
    super();
    this.#render();
  }

  #render(): void {
    this.innerHTML = "";
    if (this.#value === null || getTagType(this.#value) !== TAG.COMPOUND) return;

    for (const [name,entry] of Object.entries(this.#value as CompoundTag)){
      this.append(new NBTBranch(name,entry));
    }
  }

  get value(): RootTag | null {
    return this.#value;
  }

  set value(value: RootTag | NBTData | null) {
    if (value instanceof NBTData){
      value = value.data as RootTag;
    }
    console.log(value);
    this.#value = value;
    this.#render();
  }
}

window.customElements.define("nbt-tree",NBTTree);

declare global {
  interface HTMLElementTagNameMap {
    "nbt-tree": NBTTree;
  }
}