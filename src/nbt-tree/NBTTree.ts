import { NBTData, TAG, getTagType } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

export class NBTTree extends HTMLElement {
  #value: NBTData | null = null;

  constructor() {
    super();
    this.#render();
  }

  #render(): void {
    this.innerHTML = "";
    if (this.#value === null || getTagType(this.#value) !== TAG.COMPOUND) return;
    this.append(new NBTBranch(this.#value));
  }

  get value(): NBTData | null {
    return this.#value;
  }

  set value(value: NBTData | null) {
    // console.log(value);
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