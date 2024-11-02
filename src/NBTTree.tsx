import { createMemo } from "solid-js";
import { NBTData } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

import type { Accessor } from "solid-js";
import type { RootName, RootTag } from "nbtify";

export interface NBTTreeProps {
  name: Accessor<RootName>;
  value: Accessor<NBTData>;
}

export function NBTTree(props: NBTTreeProps) {
  const getRootTag = createMemo<RootTag>(() => props.value().data);

  return (
    <div class="nbt-tree">
      <NBTBranch
        name={props.name}
        value={getRootTag}
        open
      />
    </div>
  );
}