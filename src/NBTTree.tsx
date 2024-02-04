import { createMemo } from "solid-js";
import { NBTData } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

import type { Accessor } from "solid-js";
import type { RootName, Tag } from "nbtify";

export interface NBTTreeProps {
  name: Accessor<RootName>;
  value: Accessor<NBTData | null>;
}

export function NBTTree(props: NBTTreeProps){
  const getValue = createMemo<Tag | null>(() => props.value()?.data ?? null);

  return (
    <div class="nbt-tree">{
      getValue() !== null &&
        <NBTBranch name={props.name} value={() => getValue()!} open/>
    }</div>
  );
}