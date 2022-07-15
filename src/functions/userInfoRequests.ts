import axios from "axios"

export interface UserInfo {
    user_id: number,
    name: string,
    points: number,
    floor_points: number | null,
    goal_points: number | null,
    rank: string,
    divisions: {
        st: string | null,
        sable: string | null
    }
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

interface PointsUserPayload {
    username: string,
    increment: number,
    add_event: boolean,
}

export async function incrementPoints(usersArray: Array<PointsUserPayload>): Promise<string> {
    return await axios.post(`http://127.0.0.1:8080/users/points`, { users: usersArray }).then(response => {
        return response.data
    }).catch(e => {
        return e
    })
}