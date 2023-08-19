<script lang="ts">
  import FormatDialog from "./FormatDialog.svelte";
</script>

<header>
  <img draggable="false" src="/icon.svg" alt="">
  <button on:click={fileOpener.click}>Open</button>
  <input id="fileOpener" type="file" accept="application/octet-stream, .nbt, .dat, .dat_old">
  <button id="saver" disabled>Save</button>
  <button id="formatOpener" disabled>Format Options...</button>
  <label style="margin-inline-start: auto;">
    <input id="treeViewToggle" type="checkbox">
    Tree View
  </label>
</header>

<main>

<textarea id="editor" disabled placeholder="NBT data will show here..." wrap="off" spellcheck="false" autocomplete="off" autocapitalize="none" autocorrect="off"></textarea>
<nbt-tree id="treeView"></nbt-tree>

<FormatDialog/>

</main>