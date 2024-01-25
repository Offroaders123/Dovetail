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
        ? <details open={getName() === null}>
            <summary>{
              getName() !== null &&
                <>{
                  escapeString(getName()!)
                }{
                  getType() !== TAG.COMPOUND &&
                    ` [${Object.keys(getValue() as ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag).length}]`
                }</>
            }</summary>
            {
              Object.entries(getValue() as ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag)
                .map(([entryName,entry]) => {
                  if (entry === undefined) return;
                  // This should be handled without needing to create a new wrapper object for each tag, just to render it.
                  if (getType() === TAG.BYTE_ARRAY) entry = new Int8(entry as number);
                  if (getType() === TAG.INT_ARRAY) entry = new Int32(entry as number);
                  return <NBTBranch value={() => entry!} name={() => entryName}/>;
                })
            }
          </details>
        : <span>{
          escapeString(
            getName() === null
              ? ((): never => {
                throw new Error(`Tag type '${TAG[getType()]}' must have a name provided in reference to it's parent container.`);
              })()
              : getName()!
          ) satisfies string
        }: {
          escapeString(
            (getValue() as ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag)
              .valueOf().toString()
          ) satisfies string
        }</span>
    }</div>
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
