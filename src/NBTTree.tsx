import { NBTData } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

import { createEffect, type Accessor } from "solid-js";

export function NBTTree(props: { value: Accessor<NBTData | null>; }){
  // createEffect(() => {
  //   console.log("tree-view-value:",props.value());
  // });
  return (
    <div class="nbt-tree">{
      props.value() !== null &&
        <NBTBranch value={props.value}/>
    }</div>
  );
}