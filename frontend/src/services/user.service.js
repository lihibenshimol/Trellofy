import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import userImg from '../assets/img/u0.png'
import { socketService } from './socket.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY = 'userDB'
const BASE_URL = 'user/'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    getEmptyUser
}

window.userService = userService

function getUsers() {
    // return storageService.query(STORAGE_KEY)
    return httpService.get(BASE_URL)
}

async function getById(userId) {
    // const user = await storageService.get(STORAGE_KEY, userId)
    const user = await httpService.get(`${BASE_URL}${userId}`)
    return user
}

function remove(userId) {
    // return storageService.remove(STORAGE_KEY, userId)
    return httpService.delete(`${BASE_URL}${userId}`)
}

async function update({ _id }) {
    // const user = await storageService.get(STORAGE_KEY, _id)
    // user.score = score
    // await storageService.put(STORAGE_KEY, user)

    const user = await httpService.put(`${BASE_URL}${_id}`, { _id })
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

async function login(userCred) {
    // const users = await storageService.query(STORAGE_KEY)
    // const user = users.find(user => user.username === userCred.username && user.password === userCred.password)
    const user = await httpService.post('auth/login', userCred)
    if (user) {
        socketService.login(user._id)
        return saveLocalUser(user)
    }
    else throw new Error('Invalid credentials')
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = userImg
    // const user = await storageService.post(STORAGE_KEY, userCred)
    const user = await httpService.post('auth/signup', userCred)
    socketService.login(user._id)
    return saveLocalUser(user)
}

async function logout() {
    // sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    socketService.logout()
    const res = await httpService.post('auth/logout')
    sessionStorage.clear()
    return res
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyUser() {
    return {
        fullname: '',
        username: '',
        password: ''
    }
}

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123',score: 10000, isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 10000})
//     await userService.signup({fullname: 'Lihi Ben Shimol', username: 'lihibs', imgUrl: "https://ca.slack-edge.com/T043N4KE97B-U047SNB2ZJ7-80770c376ebd-512", password:'123', score: 10000})
//     await userService.signup({fullname: 'Aviad Malikan', username: 'Mr_Aviad', imgUrl: "https://ca.slack-edge.com/T043N4KE97B-U049KFQF1CH-a47ef54f9294-512", password:'123', score: 10000})
//     await userService.signup({fullname: 'Shay Skitel', username: 'Skitsh', imgUrl: "https://ca.slack-edge.com/T043N4KE97B-U049WM10DR6-7e045b387033-512", password:'123', score: 10000})
// })()