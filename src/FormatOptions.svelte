<dialog id="formatDialog">
  <form id="formatForm" method="dialog">
    <dialog-header>
      <h3>Format Options</h3>
      <button type="submit" aria-label="Close">✕</button>
    </dialog-header>

    <fieldset>
      <legend>Root Name</legend>

      <label>
        <input type="text" name="name" placeholder="&lt;empty&gt;">
      </label>
      <label>
        <input type="checkbox" name="disableName" onchange="this.form.elements.name.disabled = this.checked;">
        Disable
      </label>
    </fieldset>

    <fieldset>
      <legend>Endian</legend>

      <label>
        <input type="radio" name="endian" value="big">
        Big
      </label>
      <label>
        <input type="radio" name="endian" value="little">
        Little
      </label>
    </fieldset>

    <fieldset>
      <legend>Compression</legend>

      <div>
        <label>
          <input type="radio" name="compression" value="none">
          None
        </label>
        <label>
          <input type="radio" name="compression" value="gzip">
          gzip
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="compression" value="deflate">
          deflate (zlib)
        </label>
        <label>
          <input type="radio" name="compression" value="deflate-raw">
          deflate-raw
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Bedrock Level</legend>

      <label>
        <input type="number" name="bedrockLevel" placeholder="&lt;false&gt;" min="0" max="4294967295">
        <code>(Uint32)</code>
      </label>
    </fieldset>
  </form>
</dialog>