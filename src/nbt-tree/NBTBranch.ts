import { NBTData, getTagType } from "nbtify";

import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag, TAG } from "nbtify";

export class NBTBranch<T extends Tag = Tag> extends HTMLElement {
  #name: string | null;
  #type!: TAG;
  #value!: T;

  constructor(value: T | NBTData, name: string | null = null) {
    super();
    this.#name = name;
    this.value = value instanceof NBTData ? value.data as T : value;
  }

  #render(): void {
    // console.log(this.#value);
    switch (this.#type){
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 8: {
        this.innerHTML = `<label>${this.#name!}: <input value="${this.#value as ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag}"></label>`;
        break;
      }
      case 7:
      case 9:
      case 10:
      case 11:
      case 12: {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        if (this.#name !== null) summary.append(this.#name);
        for (const [name,entry] of Object.entries(this.#value as ByteArrayTag | ListTag | CompoundTag | IntArrayTag | LongArrayTag)){
          details.append(new NBTBranch(entry,name));
        }
        details.open = true;
        details.append(summary);
        this.append(details);
      }
    }
  }

  get type(): TAG {
    return this.#type;
  }

  get value(): T {
    return this.#value;
  }

  set value(value: T) {
    this.#type = getTagType(value)!;
    this.dataset["type"] = `${this.#type}`;
    this.#value = value;
    this.#render();
  }
}

window.customElements.define("nbt-branch",NBTBranch);

declare global {
  interface HTMLElementTagNameMap {
    "nbt-branch": NBTBranch;
  }
}