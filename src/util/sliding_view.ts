export class SlidingView<T> {
    private list: T[];
    private view_index: number;

    constructor(list?: T[] | null) {
        this.list = [];
        if (list != null) {
            this.list = list
        }

        this.view_index = -1;
    }

    public add(thing: T) {
        this.list.push(thing);
    }

    public find(user_id: number) {
        for (let i = 0; i < this.list.length; i++) {
            let user = this.list[i] as any;
            if (user.user_id === user_id) {
                return i + 1;
            }
        }

        return -1;
    }

    public get(num: number) {
        let return_item = [];
        for (let i = 0; i < num; i++) {
            let index = this.view_index + 1;
            if (this.list.length > index) {
                let item = this.list[index] as any
                item.index = index + 1
                return_item.push(this.list[index])
                this.view_index++;
            }
        }

        return return_item;
    }

    public next() {
        let index = this.view_index + 1;
        if (this.list.length > index) {
            this.view_index++;
            return this.list[index]
        }

        return null
    }

    public previous() {
        let index = this.view_index - 1;
        if (index >= 0) {
            this.view_index--;
            return this.list[index]
        }

        return null
    }

    public reverse(num: number) {
        let new_index = this.view_index - (num * 2)
        if (new_index < -1) {
            new_index = -1
        }

        this.view_index = new_index
        let items = this.get(num)
        this.view_index = new_index + num
        return items
    }

    public len() {
        return this.list.length
    }
}