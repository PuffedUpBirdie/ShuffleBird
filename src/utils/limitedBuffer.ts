export class LimitedBuffer {
  private readonly maxNumberOfImages: number;
  private readonly buffer: Map<string, string>;
  constructor(numberOfImages = 40) {
    if (numberOfImages < 1) throw new Error("Invalid buffer size given.");
    this.maxNumberOfImages = numberOfImages;
    this.buffer = new Map<string, string>();
  }

  add = (filename: string, src: string) => {
    if (this.buffer.size >= this.maxNumberOfImages) {
      // Remove first item
      const [key] = this.buffer.entries().next().value;
      this.buffer.delete(key);
    }
    this.buffer.set(filename, src);
  };

  get = (filename: string): string | undefined => {
    return this.buffer.get(filename);
  };

  exposeInternalMap = () => this.buffer;
}
