import axios from "axios"
import { PointsUserPayload } from "./modalFunctions"

export interface BPLog {
    time: string,
    awarder: number,
    amount: number,
    place_name?: string,
}

export interface UserInfo {
    index: any
    user_id: number,
    name: string,
    points: number,
    floor_points: number | null,
    goal_points: number | null,
    rank: string,
    divisions: {
        st: string | null,
        sable: string | null
    },
    bp_logs: Array<BPLog> | null
}

export interface Thumbnail {
    targetId: number,
    state: string,
    imageUrl: string
}
export interface HeadshotPayload {
    data: [Thumbnail]
}

export async function getUserInfo(roblox_id: number): Promise<UserInfo | null> {
    return await axios.get(`http://127.0.0.1:8080/users/${roblox_id}`).then(response => {
        let data = response.data
        if (data) {
            return data
        } else {
            return null
        }
    }).catch(e => {
        return null
    })
}

export async function getHeadshot(userId: number): Promise<string> {
    let { data } = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png`)

    let info = data as HeadshotPayload;
    if (info.data[0].state === "Completed") {
        return info.data[0].imageUrl;
    } else {
        return "https://t0.rbxcdn.com/392283e0066eba6a122cdde614500f94";
    };
}

export async function getUserIdByUsername(username: string): Promise<number> {
    let { data } = await axios.get(`https://api.roblox.com/users/get-by-username?username=${username}`)

    if (data && data.Id) {
        return data.Id as number
    } else {
        return -1
    }
}

export async function getUsernameFromUserId(user_id: number): Promise<string> {
    let { data } = await axios.get(`https://users.roblox.com/v1/users/${user_id}`)

    if (data && data.name) {
        return data.name as string
    } else {
        return "Name Unknown"
    }
}

interface Payload {
    users: Array<PointsUserPayload>,
    placeName?: string
}

export async function incrementPoints(usersArray: Array<PointsUserPayload>, placeName?: string): Promise<string> {
    let payload: Payload = {
        users: usersArray
    }

    if (placeName != null) {
        payload.placeName = placeName
    }

    return await axios.post(`http://127.0.0.1:8080/users/points`, payload).then(response => {
        return response.data
    }).catch(e => {
        return e
    })
}