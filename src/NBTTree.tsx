import { createMemo } from "solid-js";
import { NBTData } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

import type { Accessor } from "solid-js";
import type { Tag } from "nbtify";

export function NBTTree(props: { value: Accessor<NBTData | null>; }){
  const getValue = createMemo<Tag | null>(() => props.value()?.data ?? null);

  return (
    <div class="nbt-tree">{
      getValue() !== null &&
        <NBTBranch value={() => getValue()!}/>
    }</div>
  );
}