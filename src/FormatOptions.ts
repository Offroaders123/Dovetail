import { Int, Name, Endian, Compression, BedrockLevel, NBTDataOptions } from "nbtify";

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
        <input type="number" name="bedrockLevel" placeholder="&lt;false&gt;" min="0" max="4294967295" list="bedrock-level-version">
        <code>(Uint32)</code>
        <datalist id="bedrock-level-version">
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

export function getOptionsMap(formData: FormData){
  return Object.fromEntries([...formData]) as unknown as FormatOptionsMap;
}

export function getOptions({ name, disableName, endian, compression, bedrockLevel }: FormatOptionsMap){
  const options: NBTDataOptions = {
    name: (disableName === "true") ? null : name,
    endian,
    compression: (compression === "null") ? null : compression,
    bedrockLevel: (bedrockLevel === "") ? null : new Int(parseInt(bedrockLevel))
  };

  return options;
}

export class FormatOptions extends HTMLElement {
  constructor() {
    super();
    this.append(template.content.cloneNode(true));
  }

  getNBTDataOptions() {
    const formData = new FormData(this.form);
    const optionsMap = getOptionsMap(formData);
    const options = getOptions(optionsMap);
    return options;
  }

  get dialog() {
    return this.querySelector("dialog")!;
  }

  get form() {
    return this.querySelector("form")!;
  }
}

window.customElements.define("format-options",FormatOptions);

declare global {
  interface HTMLElementTagNameMap {
    "format-options": FormatOptions;
  }
}

export default FormatOptions;