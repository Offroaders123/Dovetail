import { createMemo, createSignal } from "solid-js";
import { NBTData, TAG, getTagType, Int8, Int32 } from "nbtify";

import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag } from "nbtify";

export function NBTBranch<T extends Tag = Tag>(props: { defaultValue: T | NBTData; defaultName?: string | null; }){
  const [getName,_setName] = createSignal<string | null>(props.defaultName ?? null);
  const [getValue,_setValue] = createSignal<T>(props.defaultValue instanceof NBTData ? props.defaultValue.data as T : props.defaultValue);
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
        <div class="nbt-branch">
          <span>{name satisfies string}: {value.valueOf().toString() satisfies string}</span>
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
        <div class="nbt-branch">
          <details open={type !== TAG.LIST && type !== TAG.COMPOUND}>
            <summary>{
              name !== null
                && <>{name}{
                  type !== TAG.COMPOUND
                    && `${Object.keys(value).length}`
                  }</>
            }</summary>
            {
              Object.entries(value)
                .map(([entryName,entry]) => {
                  if (entry === undefined) return;
                  // This should be handled without needing to create a new wrapper object for each tag, just to render it.
                  if (type === TAG.BYTE_ARRAY) entry = new Int8(entry as number);
                  if (type === TAG.INT_ARRAY) entry = new Int32(entry as number);
                  return <NBTBranch defaultValue={entry} defaultName={entryName}/>;
                })
            }
          </details>
        </div>
      );
    }
  }
}