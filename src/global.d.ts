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

  interface WebAppManifest {
    file_handlers: FileHandler[];
  }

  interface FileHandler {
    action: string;
    accept: FileHandlerAccept;
  }

  interface FileHandlerAccept {
    [mimeType: string]: string[];
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