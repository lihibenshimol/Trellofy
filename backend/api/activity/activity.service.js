const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const activityCollection = 'activity'

async function query(filterBy = {}) {
    try {
        // const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection(activityCollection)
        const activities = await collection.find(filterBy).toArray()
        // var activities = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUserId',
        //             from: 'user',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'onBoard',
        //             from: 'board',
        //             foreignField: '_id',
        //             as: 'onBoard'
        //         }
        //     },
        //     {
        //         $unwind: '$onBoard'
        //     }
        // ]).toArray()
        // activities = activities.map(activity => {
        //     activity.txt 
        //     activity.byUser = { id: activity.byUser._id, fullname: activity.byUser.fullname }
        //     activity.onBoard = { id: activity.onBoard._id, fullname: activity.onBoard.title }
        //     delete activity.byUserId
        //     delete activity.onBoardId
        //     return activity
        // })
        console.log('activities = ', activities.length)
        return activities
    } catch (err) {
        logger.error('cannot find activities', err)
        throw err
    }

}

async function remove(activityId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection(activityCollection)
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(activityId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const {deletedCount} = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove activity ${activityId}`, err)
        throw err
    }
}


async function add(activity) {
    try {
        const activityToAdd = {
            byUserId: ObjectId(activity.byUserId),
            onBoardId: ObjectId(activity.boardId),
            onCardId: activity.cardId,
            txt: activity.txt
        }
        const collection = await dbService.getCollection('activity')
        await collection.insertOne(activityToAdd)
        return activityToAdd
    } catch (err) {
        logger.error('cannot insert activity', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
    return criteria
}

module.exports = {
    query,
    remove,
    add
}

