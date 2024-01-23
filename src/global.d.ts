declare global {
  interface DataTransferFile extends DataTransferItem {
    readonly kind: "file";
    getAsFile(): File;
    getAsString(callback: null): void;
  }

  interface Navigator {
    /**
     * Exclusive to iOS, iPadOS, and macOS devices.
    */
    readonly standalone: boolean;
  }
}

export {};