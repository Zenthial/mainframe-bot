import axios from "axios";
import { Queue } from "../util/queue";

export async function getLeaderboardQueue(): Promise<Queue> {
    return await axios.get(`http://127.0.0.1:8080/leaderboard/`).then(response => {
        let data = response.data as [any]

        let queue = new Queue();
        for (let val of data.values()) {
            queue.enqueue(val)
        }

        return queue
    }).catch(_ => {
        return new Queue()
    });
}