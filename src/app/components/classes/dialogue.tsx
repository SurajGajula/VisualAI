export class Dialogue {
    speaker: string;
    line: string;
    constructor(
        text: string,
    ) {
        if (!text.includes(':')) {
            this.speaker = 'Unknown';
            this.line = text.trim();
            return;
        }
        
        const [speaker, ...rest] = text.split(':');
        this.speaker = speaker.trim();
        
        this.line = rest.join(':').trim();
    }
}
