import { Match, Switch, createMemo, createSignal } from "solid-js";
import { TAG, getTagType, Int8, Int32 } from "nbtify";

import type { Accessor } from "solid-js";
import type { Tag, ByteTag, ShortTag, IntTag, LongTag, FloatTag, DoubleTag, ByteArrayTag, StringTag, ListTag, CompoundTag, IntArrayTag, LongArrayTag } from "nbtify";

export interface NBTBranchProps {
  name: Accessor<string | null>;
  value: Accessor<Tag>;
  open?: boolean;
}

export function NBTBranch(props: NBTBranchProps){
  const getType = createMemo<TAG>(() => getTagType(props.value()));

  return (
    <div class="nbt-branch" data-type={getType()}>
      <Switch>
        <Match when={getType() === TAG.BYTE}>
          <ByteView name={props.name} value={props.value as Accessor<ByteTag>}/>
        </Match>
        <Match when={getType() === TAG.SHORT}>
          <ShortView name={props.name} value={props.value as Accessor<ShortTag>}/>
        </Match>
        <Match when={getType() === TAG.INT}>
          <IntView name={props.name} value={props.value as Accessor<IntTag>}/>
        </Match>
        <Match when={getType() === TAG.LONG}>
          <LongView name={props.name} value={props.value as Accessor<LongTag>}/>
        </Match>
        <Match when={getType() === TAG.FLOAT}>
          <FloatView name={props.name} value={props.value as Accessor<FloatTag>}/>
        </Match>
        <Match when={getType() === TAG.DOUBLE}>
          <DoubleView name={props.name} value={props.value as Accessor<DoubleTag>}/>
        </Match>
        <Match when={getType() === TAG.BYTE_ARRAY}>
          <ByteArrayView name={props.name} value={props.value as Accessor<ByteArrayTag>}/>
        </Match>
        <Match when={getType() === TAG.STRING}>
          <StringView name={props.name} value={props.value as Accessor<StringTag>}/>
        </Match>
        <Match when={getType() === TAG.LIST}>
          <ListView name={props.name} value={props.value as Accessor<ListTag<Tag>>} open={props.open}/>
        </Match>
        <Match when={getType() === TAG.COMPOUND}>
          <CompoundView name={props.name} value={props.value as Accessor<CompoundTag>} open={props.open}/>
        </Match>
        <Match when={getType() === TAG.INT_ARRAY}>
          <IntArrayView name={props.name} value={props.value as Accessor<IntArrayTag>}/>
        </Match>
        <Match when={getType() === TAG.LONG_ARRAY}>
          <LongArrayView name={props.name} value={props.value as Accessor<LongArrayTag>}/>
        </Match>
      </Switch>
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
  name: Accessor<string | null>;
  value: Accessor<T>;
  open?: boolean;
}

function ContainerView<T extends ContainerTag>(props: ContainerViewProps<T>){
  const [getOpen, setOpen] = createSignal<boolean>(props.open ?? false);
  const getType = createMemo<TAG>(() => getTagType(props.value()));

  return (
    <details open={getOpen()} ontoggle={event => setOpen(event.currentTarget.open)}>
      <summary>
        {
          props.name() === null
            ? <i>(unnamed)</i> :
          props.name() === ""
            ? <i>""</i> :
          escapeString(props.name()!)
        }{
          getType() !== TAG.COMPOUND &&
            ` [${Object.keys(props.value()).length}]`
        }
      </summary>
      {
        getOpen() && Object.entries(props.value())
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
    <span>
      {
        escapeString(getName())
      }: {
        escapeString(props.value().valueOf().toString() satisfies string)
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
