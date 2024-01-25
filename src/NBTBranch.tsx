import { createMemo } from "solid-js";
import { NBTData, TAG, getTagType, Int8, Int32 } from "nbtify";

import type { Accessor } from "solid-js";
import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag } from "nbtify";

export function NBTBranch<T extends Tag = Tag>(props: { value: Accessor<T | NBTData>; name?: Accessor<string | null>; }){
  const getName = createMemo<string | null>(() => props.name?.() ?? null);
  const getValue = createMemo<T>(() => {
    const value: T | NBTData = props.value();
    return value instanceof NBTData ? value.data as T : value;
  });
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
        ? <NBTBranchContainerTag name={getName} type={getType} value={() => getValue() as ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag}/>
        : <NBTBranchValueTag name={getName} type={getType} value={() => getValue() as ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag}/>
    }</div>
  );
}

function NBTBranchContainerTag(props: { name: Accessor<string | null>; type: Accessor<TAG>; value: Accessor<ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag>; }){
  return (
    <details open={props.name() === null}>
      <summary>{
        props.name() !== null &&
          <>{
            escapeString(props.name()!)
          }{
            props.type() !== TAG.COMPOUND &&
              ` [${Object.keys(props.value()).length}]`
          }</>
      }</summary>
      {
        Object.entries(props.value())
          .map(([entryName,entry]) => {
            if (entry === undefined) return;
            // This should be handled without needing to create a new wrapper object for each tag, just to render it.
            if (props.type() === TAG.BYTE_ARRAY) entry = new Int8(entry as number);
            if (props.type() === TAG.INT_ARRAY) entry = new Int32(entry as number);
            return <NBTBranch value={() => entry!} name={() => entryName}/>;
          })
      }
    </details>
  );
}

function NBTBranchValueTag(props: { name: Accessor<string | null>; type: Accessor<TAG>; value: Accessor<ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag>; }){
  return (
    <span>{
      escapeString(
        props.name() === null
          ? ((): never => {
            throw new Error(`Tag type '${TAG[props.type()]}' must have a name provided in reference to it's parent container.`);
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
