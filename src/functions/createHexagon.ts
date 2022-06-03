import path from 'path'
import { createCanvas, loadImage } from 'canvas'
import { getHeadshot } from './user_info_requests'
const width = 420
const height = 420
const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

/**
 * Creates a custom profile image with a hexagon
 * @param {number} robloxID - the robloxID of the user whos profile is needed
 */
export async function createHexagon(robloxID: number): Promise<Buffer> {
    const playerThumbnail = await getHeadshot(robloxID)
    const hexagonBackground = await loadImage(path.join(__dirname, '../../resources/canvas/hexagonSource.png'))
    const halfHexagon = await loadImage(path.join(__dirname, '../../resources/canvas/halfHexagonSource.png'))
    const playerThumbnailLoaded = await loadImage(playerThumbnail)

    context.drawImage(hexagonBackground, 0, 0, canvas.width, canvas.height)
    context.drawImage(playerThumbnailLoaded, 0, 0, canvas.width, canvas.height)
    context.rotate(28 * Math.PI / 180)
    context.clearRect(0, 274, 420, 210)
    context.rotate(-28 * Math.PI / 180)
    context.rotate(332 * Math.PI / 180)
    context.clearRect(-2, 472, 420, 210)
    context.rotate(-332 * Math.PI / 180)
    context.drawImage(halfHexagon, 0, 0, canvas.width, canvas.height)
    const buffer = canvas.toBuffer("image/png", { title: `profileCanvas${robloxID}.png` })

    return buffer
}