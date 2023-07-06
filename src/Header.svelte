<script lang="ts">
  import icon from "../public/app-512.png";
</script>

<header>
  <img height="32" draggable="false" src={icon} alt="">
  <button on:click={fileOpener.click()}>Open</button>
  <input id="fileOpener" type="file" accept="application/octet-stream, .nbt, .dat, .dat_old">
  <button id="saver" disabled>Save</button>
  <button id="formatOpener" disabled>Format Options...</button>
</header>