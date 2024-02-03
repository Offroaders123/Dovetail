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
    interface DialogHtmlAttributes<T> {
      onclose?: DialogHtmlAttributes<HTMLDialogElement>["onClose"];
      oncancel?: DialogHtmlAttributes<HTMLDialogElement>["onCancel"];
    }

    interface TextareaHTMLAttributes<T> extends Pick<InputHTMLAttributes<T>, "autocorrect"> {}
  }
}

export {};