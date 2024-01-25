import { createMemo } from "solid-js";
import { TAG, getTagType, Int8, Int32 } from "nbtify";

import type { Accessor } from "solid-js";
import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag } from "nbtify";

export interface NBTBranchProps {
  name?: Accessor<string | null>;
  value: Accessor<Tag>;
}

export function NBTBranch(props: NBTBranchProps){
  const getName = createMemo<string | null>(() => props.name?.() ?? null);
  const getType = createMemo<TAG>(() => getTagType(props.value()));
  const isContainerTag = createMemo<boolean>(() => {
    switch (getType()){
      case TAG.BYTE_ARRAY:
      case TAG.LIST:
      case TAG.COMPOUND:
      case TAG.INT_ARRAY:
      case TAG.LONG_ARRAY:
        return true;
      default:
        return false;
    }
  });

  return (
    <div class="nbt-branch" data-type={getType()}>{
      isContainerTag()
        ? <ContainerView name={getName} value={() => props.value() as ContainerTag}/>
        : <PrimitiveView name={getName} value={() => props.value() as PrimitiveTag}/>
    }</div>
  );
}

type ContainerTag = ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag;

interface ContainerViewProps {
  name: Accessor<string | null>;
  value: Accessor<ContainerTag>;
}

function ContainerView(props: ContainerViewProps){
  const getType = createMemo<TAG>(() => getTagType(props.value()));

  return (
    <details open={props.name() === null}>
      <summary>{
        props.name() !== null &&
          <>{
            escapeString(props.name()!)
          }{
            getType() !== TAG.COMPOUND &&
              ` [${Object.keys(props.value()).length}]`
          }</>
      }</summary>
      {
        Object.entries(props.value())
          .map(([entryName,entry]) => {
            if (entry === undefined) return;
            // This should be handled without needing to create a new wrapper object for each tag, just to render it.
            if (getType() === TAG.BYTE_ARRAY) entry = new Int8(entry as number);
            if (getType() === TAG.INT_ARRAY) entry = new Int32(entry as number);
            return <NBTBranch name={() => entryName} value={() => entry!}/>;
          })
      }
    </details>
  );
}

type PrimitiveTag = ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag;

interface PrimitiveViewProps<T extends PrimitiveTag> {
  name: Accessor<string | null>;
  value: Accessor<T>;
}

function PrimitiveView<T extends PrimitiveTag>(props: PrimitiveViewProps<T>){
  const getName = createMemo<string>(() => {
    const name = props.name();
    if (name === null){
      throw new Error(`Tag type '${TAG[getTagType(props.value())]}' must have a name provided in reference to it's parent container.`);
    }
    return name;
  });

  return (
    <span>{
      escapeString(getName())
    }: {
      escapeString(props.value().valueOf().toString() satisfies string)
    }</span>
  );
}

// Borrowed from NBTify's SNBT module for the time being
function escapeString(value: string): string {
  return value
    .replaceAll("\b","\\b")
    .replaceAll("\f","\\f")
    .replaceAll("\n","\\n")
    .replaceAll("\r","\\r")
    .replaceAll("\t","\\t");
}
