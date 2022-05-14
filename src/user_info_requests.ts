import axios from "axios"

export interface UserInfo {
    user_id: number,
    name: string,
    points: number,
    rank: string
}

export async function getUserInfo(roblox_id: number): Promise<UserInfo | null> {
    let { data } = await axios.get(`http://127.0.0.1:8080/users/${roblox_id}`);

    if (data) {
        return data
    } else {
        return null
    }
}