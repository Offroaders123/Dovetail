import { createEffect, createMemo } from "solid-js";
import { NBTData, TAG, getTagType, Int8, Int32 } from "nbtify";

import type { Accessor } from "solid-js";
import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag } from "nbtify";

export function NBTBranch<T extends Tag = Tag>(props: { value: Accessor<T | NBTData>; name?: Accessor<string | null>; }){
  createEffect(() => {
    if (typeof props.name?.() !== "string") console.log("tree-view-value:",props.value());
  });

  const getName = createMemo<string | null>(() => props.name?.() ?? null);
  const getValue = createMemo<T>(() => {
    const value: T | NBTData = props.value();
    return value instanceof NBTData ? value.data as T : value;
  });
  const getType = createMemo(() => getTagType(getValue()));

  switch (getType()){
    case TAG.BYTE:
    case TAG.SHORT:
    case TAG.INT:
    case TAG.LONG:
    case TAG.FLOAT:
    case TAG.DOUBLE:
    case TAG.STRING: {
      const name = getName();
      if (name === null){
        throw new Error(`Tag type '${TAG[getType()]}' must have a name provided in reference to it's parent container.`);
      }
      const value = getValue() as ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag;
      return (
        <div class="nbt-branch" data-type={getType()}>
          <span>{escapeString(name) satisfies string}: {escapeString(value.valueOf().toString()) satisfies string}</span>
        </div>
      );
    }
    case TAG.BYTE_ARRAY:
    case TAG.LIST:
    case TAG.COMPOUND:
    case TAG.INT_ARRAY:
    case TAG.LONG_ARRAY: {
      const name = getName();
      const type = getType();
      const value = getValue() as ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag;
      return (
        <div class="nbt-branch" data-type={getType()}>
          <details open={name === null}>
            <summary>{
              name !== null &&
                <>{escapeString(name)}{
                  type !== TAG.COMPOUND &&
                    ` [${Object.keys(value).length}]`
                }</>
            }</summary>
            {
              Object.entries(value)
                .map(([entryName,entry]) => {
                  if (entry === undefined) return;
                  // This should be handled without needing to create a new wrapper object for each tag, just to render it.
                  if (type === TAG.BYTE_ARRAY) entry = new Int8(entry as number);
                  if (type === TAG.INT_ARRAY) entry = new Int32(entry as number);
                  return <NBTBranch value={() => entry!} name={() => entryName}/>;
                })
            }
          </details>
        </div>
      );
    }
  }
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
