declare global {
  interface Navigator {
    /**
     * Exclusive to iOS and iPadOS devices.
    */
    readonly standalone: boolean;
  }
}

export {};