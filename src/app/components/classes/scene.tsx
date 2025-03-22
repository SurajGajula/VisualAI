import { Dialogue } from "./dialogue";

export class Scene {
    constructor(
        public dialogue: Dialogue[],
        public speakers: string[],
    ) {}
}
