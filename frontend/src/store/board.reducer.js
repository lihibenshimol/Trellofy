export const SET_BOARD = 'SET_BOARD'
export const SET_BOARDS = 'SET_BOARDS'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const UNDO_REMOVE_BOARD = 'UNDO_REMOVE_BOARD'
export const UNDO_UPDATE_BOARD = 'UNDO_UPDATE_BOARD'

const initialState = {
    boards: [],
    currBoard: null,
    lastRemovedBoard: null,
    lastUpdatedBoard: null
}

export function boardReducer(state = initialState, action) {
    let boards
    let lastRemovedBoard
    let lastUpdatedBoard
    let currBoard

    switch (action.type) {
        case SET_BOARD:
            return { ...state, currBoard: action.board }

        case SET_BOARDS:
            return { ...state, boards: action.boards }

        case REMOVE_BOARD:
            lastRemovedBoard = state.boards.find(b => b._id === action.boardId)
            boards = state.boards.filter(b => b._id !== action.boardId)
            return { ...state, boards, lastRemovedBoard }

        case UNDO_REMOVE_BOARD:
            ({ lastRemovedBoard } = state)
            boards = [lastRemovedBoard, ...state.boards]
            return { ...state, boards, lastRemovedBoard: null }

        case UNDO_UPDATE_BOARD:
            ({ lastUpdatedBoard } = state)
            currBoard = lastUpdatedBoard
            return { ...state, currBoard, lastUpdatedBoard: null }

        case ADD_BOARD:
            boards = [...state.boards, action.board]
            return { ...state, boards }

        case UPDATE_BOARD:
            lastUpdatedBoard = state.boards.find(b => (b._id === action.board._id) ? action.board : b)
            boards = state.boards.map(board => (board._id === action.board._id) ? action.board : board)
            return { ...state, currBoard: action.board, boards }

        default:
            return state
    }
}
