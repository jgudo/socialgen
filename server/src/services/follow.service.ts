import { Follow } from "@/schemas";
import { IUser } from "@/schemas/UserSchema";

export const getFollow = (
    query: Object,
    type = 'followers',
    user: IUser,
    skip?: number,
    limit?: number
): Promise<IUser[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const myFollowingDoc = await Follow.find({ user: user._id });
            const myFollowing = myFollowingDoc.map(user => user.target); // map to array of user IDs

            const agg = await Follow.aggregate([
                {
                    $match: query
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: type === 'following' ? 'target' : 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $addFields: {
                        isFollowing: { $in: ['$user._id', myFollowing] }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: '$user._id',
                        username: '$user.username',
                        firstname: '$user.firstname',
                        lastname: '$user.lastname',
                        email: '$user.email',
                        profilePicture: '$user.profilePicture',
                        isFollowing: 1
                    }
                }
            ]);

            // Map out results so we can create the 'fullname' field
            const data = agg.map(info => {
                const { firstname, lastname, ...rest } = info;
                return {
                    ...rest,
                    fullname: firstname && lastname ? `${firstname} ${lastname}` : ''
                }
            }) 

            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}