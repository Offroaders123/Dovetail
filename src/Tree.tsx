import { createMemo } from "solid-js";
import Branch from "./Branch.js";
import "./Tree.scss";

import type { Accessor } from "solid-js";
import type { NBTData, RootName, RootTag } from "nbtify";

export interface TreeProps {
  name: Accessor<RootName>;
  value: Accessor<NBTData>;
}

export default function Tree(props: TreeProps) {
  const getRootTag = createMemo<RootTag>(() => props.value().data);

  return (
    <div class="Tree">
      <Branch
        name={props.name}
        value={getRootTag}
        open
      />
    </div>
  );
}