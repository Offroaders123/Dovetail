import { NBTData, TAG, getTagType, Int8, Int32 } from "nbtify";

import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag } from "nbtify";

export class NBTBranch<T extends Tag = Tag> extends HTMLElement {
  #name: string | null;
  #value!: T;

  constructor(value: T | NBTData, name: string | null = null) {
    super();
    this.#name = name;
    this.value = value instanceof NBTData ? value.data as T : value;
  }

  #render(): void {
    // console.log(this.#value);
    switch (this.type){
      case TAG.BYTE:
      case TAG.SHORT:
      case TAG.INT:
      case TAG.LONG:
      case TAG.FLOAT:
      case TAG.DOUBLE:
      case TAG.STRING: {
        if (this.#name === null){
          throw new Error(`Tag type '${TAG[this.type]}' must have a name provided in reference to it's parent container.`);
        }
        const name = this.#name;
        const value = this.#value as ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag;
        // console.log(`${name}:`,value);
        this.innerHTML = `<span>${name satisfies string}: ${value.valueOf().toString() satisfies string}</span>`;
        break;
      }
      case TAG.BYTE_ARRAY:
      case TAG.LIST:
      case TAG.COMPOUND:
      case TAG.INT_ARRAY:
      case TAG.LONG_ARRAY: {
        const value = this.#value as ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag;
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        if (this.#name !== null){
          summary.append(`${this.#name}${this.type !== TAG.COMPOUND ? ` [${Object.keys(value).length}]` : ""}`);
          if (this.type !== TAG.LIST && this.type !== TAG.COMPOUND) details.open = true;
        } else {
          details.open = true;
        }
        details.append(summary);
        for (let [name,entry] of Object.entries(value)){
          if (entry === undefined) continue;
          // This should be handled without needing to create a new wrapper object for each tag, just to render it.
          if (this.type === TAG.BYTE_ARRAY) entry = new Int8(entry as number);
          if (this.type === TAG.INT_ARRAY) entry = new Int32(entry as number);
          details.append(new NBTBranch(entry,name));
        }
        this.append(details);
      }
    }
  }

  get type(): TAG {
    return getTagType(this.#value);
  }

  get value(): T {
    return this.#value;
  }

  set value(value: T) {
    this.#value = value;
    this.dataset["type"] = `${this.type}`;
    this.#render();
  }
}

window.customElements.define("nbt-branch",NBTBranch);

declare global {
  interface HTMLElementTagNameMap {
    "nbt-branch": NBTBranch;
  }
}