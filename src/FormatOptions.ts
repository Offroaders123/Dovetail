import { Int, Name, Endian, Compression, BedrockLevel, NBTData, NBTDataOptions } from "nbtify";

const template = document.createElement("template");
template.innerHTML = `
<dialog>
  <form method="dialog">
    <dialog-header>
      <h3>Format Options</h3>
      <button type="submit" aria-label="Close">✕</button>
    </dialog-header>

    <fieldset>
      <legend>Root Name</legend>

      <label>
        <input type="text" name="name" placeholder="&lt;empty&gt;">
      </label>
      <label>
        <input type="checkbox" name="disableName" value="true">
        Disable
      </label>
    </fieldset>

    <fieldset>
      <legend>Endian</legend>

      <label>
        <input type="radio" name="endian" value="big" checked>
        Big
      </label>
      <label>
        <input type="radio" name="endian" value="little">
        Little
      </label>
    </fieldset>

    <fieldset>
      <legend>Compression</legend>

      <label>
        <input type="radio" name="compression" value="null" checked>
        None
      </label>
      <label>
        <input type="radio" name="compression" value="gzip">
        gzip
      </label>
      <label>
        <input type="radio" name="compression" value="deflate">
        zlib
      </label>
    </fieldset>

    <fieldset>
      <legend>Bedrock Level</legend>

      <label>
        <input type="number" name="bedrockLevel" placeholder="&lt;false&gt;" min="0" max="4294967295" list="bedrockLevelVersion">
        <code>(Uint32)</code>
        <datalist id="bedrockLevelVersion">
          <option value="8">(Most common)</option>
        </datalist>
      </label>
    </fieldset>
  </form>
</dialog>
`;

export interface FormatOptionsMap {
  name: string;
  disableName?: "true";
  endian: Endian;
  compression: "null" | Compression;
  bedrockLevel: string;
}

export class FormatOptions extends HTMLElement implements NBTDataOptions {
  constructor() {
    super();
    this.append(template.content.cloneNode(true));
  }

  get dialog() {
    return this.querySelector("dialog")!;
  }

  get form() {
    return this.querySelector("form")!;
  }

  get name() {
    const nameInput = document.querySelector<HTMLInputElement>("input[type='text'][name='name']")!;
    const disableNameInput = document.querySelector<HTMLInputElement>("input[type='checkbox'][name='disableName']")!;

    const name: Name = (disableNameInput.checked) ? null : nameInput.value;
    return name;
  }

  get endian() {
    const endianInput = document.querySelector<HTMLInputElement>("input[type='radio'][name='endian'][checked]")!;

    const endian: Endian = endianInput.value as Endian;
    return endian;
  }

  get compression() {
    const compressionInput = document.querySelector<HTMLInputElement>("input[type='radio'][name='compression'][checked]")!;

    const compression: Compression | null = (compressionInput.value === "null") ? null : compressionInput.value as Compression;
    return compression;
  }

  get bedrockLevel() {
    const bedrockLevelInput = document.querySelector<HTMLInputElement>("input[type='number'][name='bedrockLevel']")!;

    const bedrockLevel: BedrockLevel | null = (bedrockLevelInput.value === "") ? null : new Int(parseInt(bedrockLevelInput.value));
    return bedrockLevel;
  }

  get options() {
    const { name, endian, compression, bedrockLevel } = this;
    const options: NBTDataOptions = { name, endian, compression, bedrockLevel };
    return options;
  }
}

window.customElements.define("format-options",FormatOptions);

declare global {
  interface HTMLElementTagNameMap {
    "format-options": FormatOptions;
  }
}

export default FormatOptions;