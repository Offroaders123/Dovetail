<script lang="ts">
  import icon from "/icon.svg";

  export let disabled: boolean;

  let fileOpener: HTMLInputElement;
</script>

<header>
  <img draggable="false" src={icon} alt="">
  <button on:click={() => fileOpener.click()}></button>
  <input bind:this={fileOpener} type="file" accept="application/octet-stream, .nbt, .dat, .dat_old">
  <button {disabled}>Save</button>
  <button {disabled}>Format Options...</button>
</header>

<style>
  header {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5em;
    border: 0 solid transparent;
    border-left-width: env(safe-area-inset-left);
    border-right-width: env(safe-area-inset-right);
    overflow: auto;
    scrollbar-width: none;
  }

  header::-webkit-scrollbar {
    display: none;
  }

  header > * {
    flex-shrink: 0;
  }

  header > img {
    margin: 4px;
    height: 24px;
  }

  @media (display-mode: window-controls-overlay) {
    header {
      min-height: env(titlebar-area-height);
      background: #445985;
      border-left-width: env(titlebar-area-x);
      border-top-width: env(titlebar-area-y);
      -webkit-app-region: drag;
    }

    header button {
      -webkit-app-region: no-drag;
    }
  }

  input[type="file"] {
    display: none;
  }
</style>