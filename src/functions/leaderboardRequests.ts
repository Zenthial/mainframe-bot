import axios from "axios";
import { SlidingView } from "../util/sliding_view";
import { UserInfo } from "./userInfoRequests";

export async function getLeaderboardView(): Promise<SlidingView<UserInfo>> {
    return await axios.get(`http://127.0.0.1:8080/leaderboard/`).then(response => {
        let data = response.data as [any]

        let view = new SlidingView<UserInfo>();
        for (let val of data.values()) {
            view.add(val)
        }

        return view
    }).catch(_ => {
        return new SlidingView<UserInfo>()
    });
}