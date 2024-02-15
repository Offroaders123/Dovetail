import { useEffect, useState } from "react";

import type { Dispatch, JSX, SetStateAction } from "react";
import type { RootName, Endian, Compression, BedrockLevel } from "nbtify";

export interface FormatOptionsProps {
  getRootName: RootName;
  setRootName: Dispatch<SetStateAction<RootName>>;
  getEndian: Endian;
  setEndian: Dispatch<SetStateAction<Endian>>;
  getCompression: Compression;
  setCompression: Dispatch<SetStateAction<Compression>>;
  getBedrockLevel: BedrockLevel;
  setBedrockLevel: Dispatch<SetStateAction<BedrockLevel>>;
  getOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function FormatOptions(props: FormatOptionsProps){
  const [getFormatDialog,setFormatDialog] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = getFormatDialog;
    if (dialog?.open && !props.getOpen){
      dialog.close();
    } else if (!dialog?.open && props.getOpen){
      dialog?.showModal();
    }
  },[props.getOpen,getFormatDialog]);

  return (
    <dialog ref={setFormatDialog} onClose={() => props.getOpen && props.setOpen(false)}>
      <form method="dialog">
        <div className="dialog-header">
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
              autoComplete="off"
              autoCorrect="on"
              disabled={props.getRootName === null}
              value={props.getRootName === null ? "" : props.getRootName}
              onChange={event => props.setRootName(event.currentTarget.value)}
            />
          </label>
          {"\n"}
          <label>
            <input
              type="checkbox"
              name="disableName"
              checked={props.getRootName === null}
              onChange={event => props.setRootName(event.currentTarget.checked ? null : "")}
            />
            {" Disable "}
          </label>
        </fieldset>

        <fieldset>
          <legend>Endian</legend>

          {
            (["big", "little"] satisfies Endian[])
              .map((endian,i) =>
                <label key={i}>
                  <input
                    type="radio"
                    name="endian"
                    value={endian}
                    checked={props.getEndian === endian}
                    onChange={() => props.setEndian(endian)}
                  />
                  {` ${endian.slice(0,1).toUpperCase()}${endian.slice(1)} `}
                </label>
              )
          }
        </fieldset>

        <fieldset>
          <legend>Compression</legend>
{/* 
          {
            ([null, "gzip", "deflate", "deflate-raw"] satisfies Compression[])
              .map((compression,i) =>
                <label key={i}>
                  <input
                    type="radio"
                    name="compression"
                    value={compression ?? "none"}
                    checked={props.getCompression === compression}
                    onChange={() => props.setCompression(compression)}
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
          } */}
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
              value={props.getBedrockLevel === null ? "" : props.getBedrockLevel}
              onChange={event => props.setBedrockLevel(event.currentTarget.value === "" ? null : event.currentTarget.valueAsNumber)}
            />
            {"\n"}<code>(Uint32)</code>{"\n"}
          </label>
        </fieldset>
      </form>
    </dialog>
  );
}