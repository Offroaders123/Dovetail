import { getTagType } from "nbtify";

import type { Tag, TAG } from "nbtify";

export class NBTBranch<T extends Tag = Tag> extends HTMLElement {
  #name!: string;
  #type!: TAG;
  #value!: T;

  constructor(name: string, value: T) {
    super();
    this.#name = name;
    this.value = value;
  }

  #render(): void {
    this.dataset["type"] = `${this.#type}`;
    this.innerText = `${this.#name}: ${this.#value}`;
  }

  get name(): string {
    return this.#name;
  }

  get type(): TAG {
    return this.#type;
  }

  get value(): T {
    return this.#value;
  }

  set value(value: T) {
    this.#type = getTagType(value)!;
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