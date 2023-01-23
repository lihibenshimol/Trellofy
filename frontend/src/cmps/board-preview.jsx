import { useNavigate } from "react-router-dom"
import { updateBoard } from "../store/board.actions"

export function BoardPreview({ board, type }) {

    const navigate = useNavigate()

    function onStarBoard(ev) {
        ev.stopPropagation()
        board.isStarred = !board.isStarred
        board.starredAt = Date.now()
        updateBoard(board)
    }

    function onBoardClick() {
        navigate(`/board/${board._id}`)
        board.lastViewed = Date.now()
        updateBoard(board)
    }

    return (
        <article onClick={onBoardClick} style={board.style ? board.style : { backgroundColor: '#026aa7' }} className="board-preview">
            <h3>{board.title}</h3>
            {type !== 'recent' && <i onClick={onStarBoard} className={board.isStarred ? 'fa-regular star starred' : 'fa-regular star'}></i>}
        </article>
    )
}