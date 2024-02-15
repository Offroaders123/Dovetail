import { useMemo } from "react";
import { NBTData } from "nbtify";
import { NBTBranch } from "./NBTBranch.js";

import type { RootName } from "nbtify";

export interface NBTTreeProps {
  name: RootName;
  value: NBTData;
}

export function NBTTree(props: NBTTreeProps){
  const getRootTag = useMemo(() => props.value.data,[props.value]);

  return (
    <div className="nbt-tree">
      <NBTBranch name={props.name} value={getRootTag} open/>
    </div>
  );
}