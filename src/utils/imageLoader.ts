/** 
 * Class to manage loading images and moving along the stack of said images
 */
export class ImageLoader {
    //  ToDo: Add buffering to loader;
    private readonly buffer: any = {};
    private readonly stack: string[] = [];

    private position?: number = undefined;
    /**
     * @param files 
     * List of failes to go through
     */
    constructor(private files: string[]) {
        if(!files && !files.length) throw new Error("No files given");
    }
    
    getImage = (filename: string) => {
        return window.funcs
        .loadImage(filename)
        .then((img: string) => {
            return img
        });
    }

    getRandomFilename = () => {
        let randomImageIndex = Math.floor(Math.random() * this.files.length);
        return this.files[randomImageIndex]
    }

    getNewFilename = (): string => {
        const filename = this.getRandomFilename();

        // If we got the same file as the last one and we have more than one image
        // try to get a different one for a better "randomization"
        if(filename === this.stack[this.position] && this.files.length > 1)
            return this.getNewFilename()

        return filename;
    }

    forward = () => {
        // If at the last position in the stack generate a new image;
        if(this.position === undefined || this.position === this.stack.length - 1) {
            const filename = this.getNewFilename()
            this.stack.push(filename);
            this.position = this.stack.length - 1;
            return this.getImage(filename);
        } else {
            const filename = this.stack[++this.position];
            return this.getImage(filename);
        }
    }

    backwards = () => {
        return this.position && this.position > 0
            ? this.getImage(this.stack[--this.position])
            : null
    }
}