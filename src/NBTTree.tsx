import { createSignal } from "solid-js";
import { NBTData } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

export function NBTTree(props: { defaultValue: NBTData | null; }){
  const [getValue,_setValue] = createSignal(props.defaultValue);
  const value = getValue();

  return (
    <div class="nbt-tree">{
      value !== null
        && <NBTBranch defaultValue={value}/>
    }</div>
  );
}