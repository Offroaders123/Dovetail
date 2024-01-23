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

declare module "solid-js" {
  export namespace JSX {
    interface TextareaHTMLAttributes extends Pick<InputHTMLAttributes<HTMLInputElement>, "autocorrect"> {}
  }
}

export {};