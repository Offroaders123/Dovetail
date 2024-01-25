import { createMemo } from "solid-js";
import { TAG, getTagType, Int8, Int32 } from "nbtify";

import type { Accessor } from "solid-js";
import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag } from "nbtify";

export function NBTBranch(props: { value: Accessor<Tag>; name?: Accessor<string | null>; }){
  const getName = createMemo<string | null>(() => props.name?.() ?? null);
  const getValue = props.value;
  const getType = createMemo<TAG>(() => getTagType(getValue()));
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
        ? <NBTBranchContainerTag name={getName} value={() => getValue() as ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag}/>
        : <NBTBranchValueTag name={getName} value={() => getValue() as ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag}/>
    }</div>
  );
}

function NBTBranchContainerTag(props: { name: Accessor<string | null>; value: Accessor<ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag>; }){
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
            return <NBTBranch value={() => entry!} name={() => entryName}/>;
          })
      }
    </details>
  );
}

function NBTBranchValueTag(props: { name: Accessor<string | null>; value: Accessor<ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag>; }){
  const getType = createMemo<TAG>(() => getTagType(props.value()));

  return (
    <span>{
      escapeString(
        props.name() === null
          ? ((): never => {
            throw new Error(`Tag type '${TAG[getType()]}' must have a name provided in reference to it's parent container.`);
          })()
          : props.name()!
      ) satisfies string
    }: {
      escapeString(
        props.value()
          .valueOf().toString()
      ) satisfies string
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
