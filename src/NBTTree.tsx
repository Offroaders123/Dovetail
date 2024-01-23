import { NBTData } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

import type { Accessor } from "solid-js";

export function NBTTree(props: { value: Accessor<NBTData | null>; }){
  return (
    <div class="nbt-tree">{
      props.value() !== null &&
        <NBTBranch value={() => props.value()!}/>
    }</div>
  );
}