import { LimitedBuffer } from "./limitedBuffer";

const BufferLimit = 20;
/**
 * Class to manage loading images and moving along the stack of said images
 */
export class ImageLoader {
  //  ToDo: Add buffering to loader;
  private readonly buffer: LimitedBuffer;
  private readonly stack: string[] = [];

  private position?: number = undefined;
  /**
   * @param files
   * List of failes to go through
   */
  constructor(private files: string[]) {
    if (!files && !files.length) throw new Error("No files given");
    this.buffer = new LimitedBuffer(BufferLimit);
  }

  getImage = (filename: string): Promise<string> =>
    window.funcs.loadImage(filename).then((img: string) => {
      return img;
    });

  getRandomFilename = () => {
    const randomImageIndex = Math.floor(Math.random() * this.files.length);
    return this.files[randomImageIndex];
  };

  getNewFilename = (): string => {
    const filename = this.getRandomFilename();

    // If we got the same file as the last one and we have more than one image
    // try to get a different one for a better "randomization"
    if (filename === this.stack[this.position] && this.files.length > 1)
      return this.getNewFilename();

    return filename;
  };

  retrieveFile = async (filename: string) => {
    const cachedImg = this.buffer.get(filename);
    if (cachedImg)
      return {
        filename,
        src: cachedImg,
      };

    const data = await this.getImage(filename).then((src) => ({
      filename,
      src,
    }));

    this.buffer.add(filename, data.src);
    return data;
  };

  forward = async () => {
    // If at the last position in the stack generate a new image;
    if (
      this.position === undefined ||
      this.position === this.stack.length - 1
    ) {
      const filename = this.getNewFilename();
      this.stack.push(filename);
      this.position = this.stack.length - 1;

      return this.retrieveFile(filename);
    } else {
      const filename = this.stack[++this.position];
      return this.retrieveFile(filename);
    }
  };

  backwards = async () => {
    if (!this.position || this.position === 0) return null;

    const filename = this.stack[--this.position];

    return this.retrieveFile(filename);
  };

  // Tries to return items in the buffer based on the latest images in stack.
  getSampleImages = () => {
    const lastImages = this.stack.slice(0, BufferLimit).reverse();
    const mapIterator = this.buffer.exposeInternalMap().entries();
    const entries = [...mapIterator];

    const result = entries.sort((a, b) => {
      const [filenameA] = a;
      const [filenameB] = b;
      const indexA = lastImages.indexOf(filenameA);
      const indexB = lastImages.indexOf(filenameB);

      return (
        (indexA >= 0 ? indexA : Infinity) - (indexB >= 0 ? indexB : Infinity)
      );
    });

    return result;
  };

  getProgress = () => ({
    count: this.stack.length - 1,
    sampleImages: this.getSampleImages(),
  });
}
