import { useMemo } from "react";
import { TAG, getTagType, Int8, Int32 } from "nbtify";

import type { ReactNode } from "react";
import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag } from "nbtify";

export interface NBTBranchProps {
  name: string | null;
  value: Tag;
  open?: boolean;
}

export function NBTBranch(props: NBTBranchProps){
  const getType = useMemo<TAG>(() => getTagType(props.value),[props.value]);

  return (
    <div className="nbt-branch" data-type={getType}>
      {((): ReactNode => {
        switch (getType){
          case TAG.BYTE: return <ByteView name={props.name} value={props.value as ByteTag}/>;
          case TAG.SHORT: return <ShortView name={props.name} value={props.value as ShortTag}/>;
          case TAG.INT: return <IntView name={props.name} value={props.value as IntTag}/>;
          case TAG.LONG: return <LongView name={props.name} value={props.value as LongTag}/>;
          case TAG.FLOAT: return <FloatView name={props.name} value={props.value as FloatTag}/>;
          case TAG.DOUBLE: return <DoubleView name={props.name} value={props.value as DoubleTag}/>;
          case TAG.BYTE_ARRAY: return <ByteArrayView name={props.name} value={props.value as ByteArrayTag}/>;
          case TAG.STRING: return <StringView name={props.name} value={props.value as StringTag}/>;
          case TAG.LIST: return <ListView name={props.name} value={props.value as ListTag<Tag>} open={props.open}/>;
          case TAG.COMPOUND: return <CompoundView name={props.name} value={props.value as CompoundTag} open={props.open}/>;
          case TAG.INT_ARRAY: return <IntArrayView name={props.name} value={props.value as IntArrayTag}/>;
          case TAG.LONG_ARRAY: return <LongArrayView name={props.name} value={props.value as LongArrayTag}/>;
        }
      })()}
    </div>
  );
}

function ByteArrayView(props: ContainerViewProps<ByteArrayTag>){
  return <ContainerView {...props}/>;
}

function ListView(props: ContainerViewProps<ListTag<Tag>>){
  return <ContainerView {...props}/>;
}

function CompoundView(props: ContainerViewProps<CompoundTag>){
  return <ContainerView {...props}/>;
}

function IntArrayView(props: ContainerViewProps<IntArrayTag>){
  return <ContainerView {...props}/>;
}

function LongArrayView(props: ContainerViewProps<LongArrayTag>){
  return <ContainerView {...props}/>;
}

type ContainerTag = ByteArrayTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag;

interface ContainerViewProps<T extends ContainerTag> {
  name: string | null;
  value: T;
  open?: boolean;
}

function ContainerView<T extends ContainerTag>(props: ContainerViewProps<T>){
  const getType = useMemo<TAG>(() => getTagType(props.value),[props.value]);

  return (
    <details open={props.open}>
      <summary>
        {
          props.name === null
            ? <i>(unnamed)</i> :
          props.name === ""
            ? <i>""</i> :
          escapeString(props.name!)
        }{
          getType !== TAG.COMPOUND &&
            ` [${Object.keys(props.value).length}]`
        }
      </summary>
      {
        Object.entries(props.value)
          .map(([entryName,entry]) => {
            if (entry === undefined) return;
            // This should be handled without needing to create a new wrapper object for each tag, just to render it.
            if (getType === TAG.BYTE_ARRAY) entry = new Int8(entry as number);
            if (getType === TAG.INT_ARRAY) entry = new Int32(entry as number);
            return <NBTBranch name={entryName} value={entry}/>;
          })
      }
    </details>
  );
}

function ByteView(props: PrimitiveViewProps<ByteTag>){
  return <PrimitiveView {...props}/>;
}

function ShortView(props: PrimitiveViewProps<ShortTag>){
  return <PrimitiveView {...props}/>;
}

function IntView(props: PrimitiveViewProps<IntTag>){
  return <PrimitiveView {...props}/>;
}

function LongView(props: PrimitiveViewProps<LongTag>){
  return <PrimitiveView {...props}/>;
}

function FloatView(props: PrimitiveViewProps<FloatTag>){
  return <PrimitiveView {...props}/>;
}

function DoubleView(props: PrimitiveViewProps<DoubleTag>){
  return <PrimitiveView {...props}/>;
}

function StringView(props: PrimitiveViewProps<StringTag>){
  return <PrimitiveView {...props}/>;
}

type PrimitiveTag = ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | StringTag;

interface PrimitiveViewProps<T extends PrimitiveTag> {
  name: string | null;
  value: T;
}

function PrimitiveView<T extends PrimitiveTag>(props: PrimitiveViewProps<T>){
  const getName = useMemo<string>(() => {
    const name = props.name;
    if (name === null){
      throw new Error(`Tag type '${TAG[getTagType(props.value)]}' must have a name provided in reference to it's parent container.`);
    }
    return name;
  },[props.name,props.value]);

  return (
    <span>
      {
        escapeString(getName)
      }: {
        escapeString(props.value.valueOf().toString() satisfies string)
      }
    </span>
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
