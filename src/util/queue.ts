export class Queue {
    private items: any[];

    constructor() {
        this.items = [];
    }

    public enqueue(item: any) {
        this.items.push(item)
    }

    public dequeue(): any {
        return this.items.shift()
    }

    public len(): number {
        return this.items.length
    }
}