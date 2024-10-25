import { createEffect, createSignal } from "solid-js";

import type { Accessor, JSX, Setter } from "solid-js";
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
  getOpen: Accessor<boolean>;
  setOpen: Setter<boolean>;
}

export function FormatOptions(props: FormatOptionsProps){
  const [getFormatDialog,setFormatDialog] = createSignal<HTMLDialogElement | null>(null);

  createEffect(() => {
    const dialog = getFormatDialog();
    if (dialog?.open && !props.getOpen()){
      dialog.close();
    } else if (!dialog?.open && props.getOpen()){
      dialog?.showModal();
    }
  });

  return (
    <dialog ref={setFormatDialog} onclose={() => props.getOpen() && props.setOpen(false)}>
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
              value={props.getRootName() === null ? "" : props.getRootName()!}
              oninput={event => props.setRootName(event.currentTarget.value)}
            />
          </label>
          {"\n"}
          <label>
            <input
              type="checkbox"
              name="disableName"
              checked={props.getRootName() === null}
              oninput={event => props.setRootName(event.currentTarget.checked ? null : "")}
            />
            {" Disable "}
          </label>
        </fieldset>

        <fieldset>
          <legend>Endian</legend>

          {
            (["big", "little", "little-varint"] satisfies Endian[])
              .map(endian =>
                <label>
                  <input
                    type="radio"
                    name="endian"
                    value={endian}
                    checked={props.getEndian() === endian}
                    oninput={() => props.setEndian(endian)}
                  />
                  {` ${endian.slice(0,1).toUpperCase()}${endian.slice(1)} `}
                </label>
              )
          }
        </fieldset>

        <fieldset>
          <legend>Compression</legend>

          {
            ([null, "gzip", "deflate", "deflate-raw"] satisfies Compression[])
              .map(compression =>
                <label>
                  <input
                    type="radio"
                    name="compression"
                    value={compression ?? "none"}
                    checked={props.getCompression() === compression}
                    oninput={() => props.setCompression(compression)}
                  />
                  {` ${compression === "deflate" ? `${compression} (zlib)` : compression ?? "None"} `}
                </label>
              )
              .reduce<JSX.Element[]>((previous, compression, i) => {
                if (i % 2 === 0){
                  previous.push(<div>{compression}</div>);
                } else {
                  (previous.at(-1) as HTMLDivElement).append(compression as HTMLLabelElement);
                }
                return previous;
              },[])
          }
        </fieldset>

        <fieldset>
          <legend>Bedrock Level</legend>

          <label>
            <input
              type="checkbox"
              name="bedrockLevel"
              checked={props.getBedrockLevel()}
              oninput={event => props.setBedrockLevel(event.currentTarget.checked)}
            />
            {"\n"}<code>(Uint32)</code>{"\n"}
          </label>
        </fieldset>
      </form>
    </dialog>
  );
}