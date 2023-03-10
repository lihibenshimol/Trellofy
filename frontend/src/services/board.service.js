import { updateCard } from '../store/board.actions.js'
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { httpService } from './http.service.js'
// import { userService } from './user.service.js'

const STORAGE_KEY = 'board'
const BASE_URL = 'board/'

export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyBoard,
    getEmptyGroup,
    getBoardColors,

    //Cards
    getCardById,
    getEmptyCard,
    saveCard,
    removeCard,
    getEmptyTodo,
    getCardCoverColors,
    getEmptyAttachment,
    addNewCard,

    //groups
    addNewGroup,
    removeGroup,


    // getEmptyMember,
    getEmptyChecklist,

}
window.cs = boardService

async function query(filterBy = {}) {
    const queryParams = filterBy.isStarred ? `?isStarred=true` : ''
    return httpService.get(BASE_URL + queryParams)
}

function getById(boardId) {
    return httpService.get(BASE_URL + boardId)
}

async function remove(boardId) {
    return httpService.delete(BASE_URL + boardId)
}

async function save(board) {
    if (board._id) {
        return httpService.put(BASE_URL + board._id, board)
    } else {
        return httpService.post(BASE_URL, board)
    }
}

function getEmptyCard() {
    return { title: '', checklists: [], members: [], labels: [] }
}

function getEmptyGroup() {
    return { title: '', cards: [], style: {} }
}

function getEmptyTodo() {
    return {
        id: utilService.makeId(),
        title: '',
        isDone: false,
    }
}

function getEmptyChecklist() {
    return {
        id: utilService.makeId(),
        title: 'Checklist',
        todos: [],
    }
}
function getEmptyAttachment() {
    return {
        id: utilService.makeId(),
        title: '',
        createAt: Date.now(),
        imgUrl: '',
        bg: '',
    }
}


// async function updateCard(boardId, card, content, key) {
//     card[key] = content
//     save(boardId)
// }

//CARDS

async function addNewCard(boardId, groupId, cardToAdd) {
    try {
        return httpService.post(BASE_URL + `${boardId}/g/${groupId}`, { boardId, groupId, cardToAdd })
    } catch (err) {
        console.log('failed')
        throw err
    }
}

async function addNewGroup(boardId, groupToAdd) {
    try {
        return httpService.post(BASE_URL + `${boardId}/g`, { boardId, groupToAdd })
    } catch (err) {
        console.log('failed')
        throw err
    }
}

async function removeGroup(board, groupId) {

        const groupIndex = board.groups.findIndex(g => g.id === groupId)

        try {
            board.groups.splice(groupIndex, 1)
            const savedBoard = await save(board)
            return savedBoard
        } catch (err) {
            console.log('Cannot remove card = ', err)
        }

}

function getEmptyBoard() {
    return {
        title: "",
        isStarred: false,
        style: { backgroundColor: '#0079bf' },
        // "createdBy": {
        //     "_id": "u101",
        //     "fullname": "Abi Abambi",
        //     "imgUrl": "http://some-img"
        // },
        // "style": {},
        labels: [
            {
                "id": "l101",
                "title": "Done",
                "color": "#61bd4f"
            },
            {
                "id": "l102",
                "title": "Progress",
                "color": "#f5e340"
            },
            {
                "id": "l103",
                "title": "",
                "color": "#ffaf3f"
            },
            {
                "id": "l104",
                "title": "Important",
                "color": "#f54040"
            },
            {
                "id": "l105",
                "title": "",
                "color": "#cd8de5"
            },
            {
                "id": "l106",
                "title": "",
                "color": "#5ba4cf"
            },
            {
                "id": "l107",
                "title": "",
                "color": "#091e42"
            }
        ],
        // "members": [
        //     {
        //         "_id": "u101",
        //         "fullname": "Tal Tarablus",
        //         "imgUrl": "https://www.google.com"
        //     }
        // ],
        groups: [
        ]
    }
}

function getBoardColors() {
    return ['#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91', '#4bbf6b', '#00aecc', '#838c91']
}
function getCardCoverColors() {
    return ['#7bc86c', '#f5dd29', "#ffaf3f", '#ef7564', '#cd8de5', '#5ba4cf', '#29cce5', '#6deca9', '#ff8ed4', '#172b4d']
}


//Card service

async function getCardById(board, groupId, cardId) {
    const group = board.groups.find(g => g.id === groupId)
    const card = group.cards.find(c => c.id === cardId)
    return card
}

async function saveCard(board, groupId, updatedCard) {
    const group = board.groups.find(g => g.id === groupId)
    const newCards = group.cards.map(card => (card.id === updatedCard.id) ? updatedCard : card)
    group.cards = newCards

    board.groups = board.groups.map(g => (g.id === group.id) ? group : g)
    // console.log('board: ', board)

    const savedBoard = await save(board)
    return savedBoard
}

async function removeCard(board, groupId, cardId) {
    const group = board.groups.find(g => g.id === groupId)
    const cardIndex = group.cards.findIndex(c => c.id === cardId)
    try {
        group.cards.splice(cardIndex, 1)
        const savedBoard = await save(board)
        return savedBoard
    } catch (err) {
        console.log('Cannot remove card = ', err)
    }
}


function _createDemoBoards() {
    let boards = utilService.loadFromStorage(STORAGE_KEY)
    if (!boards || !boards.length) {
        boards = [
            {
                "_id": "b101",
                "title": "Sprint 4",
                "isStarred": false,
                // "createdBy": {
                //     "_id": "u101",
                //     "fullname": "Abi Abambi",
                //     "imgUrl": "http://some-img"
                // },
                "style": {
                    backgroundColor: "#3d5a80"
                },
                "labels": [
                    {
                        "id": "l101",
                        "title": "Done",
                        "color": "#61bd4f"
                    },
                    {
                        "id": "l102",
                        "title": "Progress",
                        "color": "#f5e340"
                    },
                    {
                        "id": "l103",
                        "title": "",
                        "color": "#ffaf3f"
                    },
                    {
                        "id": "l104",
                        "title": "Important",
                        "color": "#f54040"
                    },
                    {
                        "id": "l105",
                        "title": "",
                        "color": "#cd8de5"
                    },
                    {
                        "id": "l106",
                        "title": "",
                        "color": "#5ba4cf"
                    },
                    {
                        "id": "l107",
                        "title": "",
                        "color": "#091e42"
                    },
                ],
                "members": [
                    {
                        "_id": "6yBQqcMDlP",
                        "fullname": "Lihi Ben Shimol",
                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U047SNB2ZJ7-80770c376ebd-512"
                    },
                    {
                        "_id": "cWZFwumkpu",
                        "fullname": "Aviad Malikan",
                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U049KFQF1CH-a47ef54f9294-512"
                    },
                    {
                        "_id": "MxqOGVX0NK",
                        "fullname": "Shay Skitel",
                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U049WM10DR6-7e045b387033-512"
                    },
                ],
                "groups": [
                    {
                        "id": "g101",
                        "title": "Backlog - client",
                        // "archivedAt": 1589983468418,
                        "cards": [
                            {
                                "id": "c101",
                                "title": "Build app header",
                                "members": [
                                    {
                                        "_id": "u101",
                                        "fullname": "Lihi Ben Shimol",
                                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U047SNB2ZJ7-80770c376ebd-512",
                                        isChecked: true
                                    }
                                ],
                                cover: "#f5dd29",
                                checklists: [],
                                labels: [],
                                attachments: [
                                    {
                                        id: 'a101',
                                        imgUrl: `https://images.unsplash.com/photo-1674405509776-00a3cf19720e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=435&q=80`,
                                        title: 'Dog smile',
                                        createAt: 1365466464,
                                    },
                                    {
                                        id: 'a102',
                                        imgUrl: `https://images.unsplash.com/photo-1608096299210-db7e38487075?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80`,
                                        title: 'sand',
                                        createAt: 1365466464,
                                    },
                                ]
                            },
                            {
                                "id": "c102",
                                "title": "Implementing client-side functionality such as form validation, page transitions, and interactive elements",
                                checklists: [],
                                members: [],
                                labels: [],
                            },
                            {
                                "id": "c103",
                                "title": "Create and maintain client-side documentation",
                                checklists: [],
                                members: [],
                                labels: [],
                            }
                        ],
                        "style": {}
                    },
                    {
                        "id": "g102",
                        "title": "Backlog - server",
                        // "archivedAt": 1589983468418,
                        "cards": [
                            {
                                "id": "c104",
                                "title": "Add user authentication",
                                checklists: [],
                                members: [
                                    {
                                        "_id": "u102",
                                        "fullname": "Aviad Malikan",
                                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U049KFQF1CH-a47ef54f9294-512",
                                        isChecked: true

                                    }
                                ],
                                labels: [],
                                attachments: [
                                    {
                                        id: 'a101',
                                        imgUrl: `https://res.cloudinary.com/djr3esqjq/video/upload/v1674491166/samples/sea-turtle.mp4`,
                                        title: 'sea',
                                        createAt: 1365466464,
                                        format: 'mp4'
                                    },
                                ]
                            },
                            {
                                "id": "c105",
                                "title": "Connect socket service",
                                members: [
                                    {
                                        "_id": "u103",
                                        "fullname": "Shay Skitel",
                                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U049WM10DR6-7e045b387033-512"
                                    }
                                ],
                                labels: [],
                                checklists: [
                                    {
                                        id: 'YEhmF',
                                        title: 'Checklist',
                                        todos: [
                                            {
                                                id: '212jX',
                                                title: 'Test msg sent',
                                                isDone: false
                                            },
                                            {
                                                id: '213jX',
                                                title: 'Fix brodcast of msg',
                                                isDone: true
                                            },
                                            {
                                                id: '214jX',
                                                title: 'Test loggedin user alerts',
                                                isDone: false
                                            },
                                        ]
                                    },
                                ]
                            }
                        ],
                        "style": {}
                    },
                    {
                        "id": "g103",
                        "title": "In development",
                        // "archivedAt": 1589983468418,
                        "cards": [
                            {
                                "id": "c106",
                                "title": "Server routes and API's",
                                checklists: [],
                                members: [
                                    {
                                        // "_id": "u102",
                                        // "fullname": "Aviad Malikan",
                                        // "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U049KFQF1CH-a47ef54f9294-512",
                                        // isChecked: true

                                        "_id": "u102",
                                        "fullname": "Aviad Malikan",
                                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U049KFQF1CH-a47ef54f9294-512",
                                        isChecked: true
                                    }
                                ],
                                labels: [],
                                cover: "#5ba4cf"
                            },
                            {
                                "id": "c107",
                                "title": "Admin authentication and options",
                                members: [],
                                labels: [],
                                checklists: [
                                    {
                                        id: 'YEhmF',
                                        title: 'Checklist',
                                        todos: [
                                            {
                                                id: '220jX',
                                                title: 'Admin user profile',
                                                isDone: true
                                            },

                                        ]
                                    },
                                ]
                            }
                        ],
                        "style": {}
                    },
                    {
                        "id": "g104",
                        "title": "QA",
                        // "archivedAt": 1589983468418,
                        "cards": [
                            {
                                "id": "c108",
                                "title": "Mobile resposive and flexible css",
                                checklists: [],
                                members: [
                                    {
                                        // "_id": "u102",
                                        // "fullname": "Aviad Malikan",
                                        // "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U049KFQF1CH-a47ef54f9294-512",
                                        // isChecked: true

                                    }
                                ],
                                members: [],
                                labels: [],
                            },
                            {
                                "id": "c109",
                                "title": "Ensuring that the frontend code is accessible and compliant with web standards",
                                members: [
                                    {
                                        "_id": "u103",
                                        "fullname": "Shay Skitel",
                                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U049WM10DR6-7e045b387033-512"
                                    },
                                    {
                                        "_id": "u101",
                                        "fullname": "Lihi Ben Shimol",
                                        "imgUrl": "https://ca.slack-edge.com/T043N4KE97B-U047SNB2ZJ7-80770c376ebd-512"
                                    }
                                ],
                                labels: [],
                                checklists: [],
                                cover: "#ef7564"
                            }
                        ],
                        "style": {}
                    },
                ]
            },
            {
                groups: [],
                isStarred: false,
                labels: [],
                style: {
                    backgroundColor: null, backgroundImage: "url(/static/media/bg-img-4.be3ac8c92f74564819c8.jpg)"
                },
                title: "Iceland 2023",
                _id: "O9qs3MWx7p"
            },
            {
                groups: [],
                isStarred: false,
                labels: [],
                style: {
                    backgroundColor: null,
                    backgroundImage: "url(/static/media/bg-img-5.de5659898d3bfc5eb8ea.jpg)"
                },
                title: "Fullstack bootcamp",
                _id: "hKLJZmXjbf"
            },
            {
                groups: [],
                isStarred: false,
                labels: [],
                style: {
                    backgroundColor: null,
                    backgroundImage: "url(/static/media/bg-img-6.624349ed01b920f8b7c5.jpg)"
                },
                title: "House renovation",
                _id: "uegPI5Gxmv"
            },
            {
                groups: [],
                isStarred: false,
                labels: [],
                style: {
                    backgroundColor: "#519839",
                    backgroundImage: null
                },
                title: "Holiday menu",
                _id: "hkx9bR0e46"
            },
        ]
        utilService.saveToStorage(STORAGE_KEY, boards)
    }
}