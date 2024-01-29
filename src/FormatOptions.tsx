import { createMemo } from "solid-js";

import type { Accessor, Setter } from "solid-js";
import type { RootName, Endian, Compression, BedrockLevel } from "nbtify";

export interface FormatOptionsProps {
  getRootName: Accessor<RootName>;
  setRootName: Setter<RootName>;
  getEndian: Accessor<Endian>;
  setEndian: Setter<Endian>;
  getCompression: Accessor<Compression>;
  setCompression: Setter<Compression>;
  getBedrockLevel: Accessor<BedrockLevel>;
  setBedrockLevel: Setter<BedrockLevel>;
  setFormatDialog: Setter<HTMLDialogElement | null>;
}

export function FormatOptions(props: FormatOptionsProps){
  const rootName = createMemo<string>(previous => {
    const rootName = props.getRootName();
    return rootName ?? previous ?? "";
    // return rootName === null ? previous ?? "" : rootName;
  });

  return (
    <dialog ref={props.setFormatDialog}>
      <form method="dialog">
        <div class="dialog-header">
          <h3>Format Options</h3>
          <button type="submit" aria-label="Close">✕</button>
        </div>

        <fieldset>
          <legend>Root Name</legend>

          <label>
            <input
              type="text"
              name="name"
              placeholder="&lt;empty&gt;"
              autocomplete="off"
              autocorrect="on"
              disabled={props.getRootName() === null}
              value={rootName()}
              oninput={event => props.setRootName(event.currentTarget.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              name="disableName"
              checked={props.getRootName() === null}
              oninput={event => props.setRootName(event.currentTarget.checked ? null : "")}
            />
            Disable
          </label>
        </fieldset>

        <fieldset>
          <legend>Endian</legend>

          <label>
            <input
              type="radio"
              name="endian"
              value="big"
              checked={props.getEndian() === "big"}
              oninput={() => props.setEndian("big")}
            />
            Big
          </label>
          <label>
            <input
              type="radio"
              name="endian"
              value="little"
              checked={props.getEndian() === "little"}
              oninput={() => props.setEndian("little")}
            />
            Little
          </label>
        </fieldset>

        <fieldset>
          <legend>Compression</legend>

          <div>
            <label>
              <input
                type="radio"
                name="compression"
                value="none"
                checked={props.getCompression() === null}
                oninput={() => props.setCompression(null)}
              />
              None
            </label>
            <label>
              <input
                type="radio"
                name="compression"
                value="gzip"
                checked={props.getCompression() === "gzip"}
                oninput={() => props.setCompression("gzip")}
              />
              gzip
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name="compression"
                value="deflate"
                checked={props.getCompression() === "deflate"}
                oninput={() => props.setCompression("deflate")}
              />
              deflate (zlib)
            </label>
            <label>
              <input
                type="radio"
                name="compression"
                value="deflate-raw"
                checked={props.getCompression() === "deflate-raw"}
                oninput={() => props.setCompression("deflate-raw")}
              />
              deflate-raw
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Bedrock Level</legend>

          <label>
            <input
              type="number"
              name="bedrockLevel"
              placeholder="&lt;false&gt;"
              min="0"
              max="4294967295"
              value={props.getBedrockLevel() === null ? "" : props.getBedrockLevel()!}
              oninput={event => props.setBedrockLevel(event.currentTarget.value === "" ? null : event.currentTarget.valueAsNumber)}
            />
            <code>(Uint32)</code>
          </label>
        </fieldset>
      </form>
    </dialog>
  );
}