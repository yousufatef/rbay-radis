import { userKey, usernamesKey, usernamesUniqueKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';


export const getUserByUsername = async (username: string) => {
    // ise the username arg to look up the persons user ID
    // with the usernames sorted set

    const decimalId = await client.zScore(usernamesKey(), username)

    // make sure we actually got an ID from the lookup
    if (!decimalId) {
        throw new Error("user does not exist")
    }
    // take the id and convert it back to hex
    const id = decimalId.toString(16)
    // use the id to look up the user's hash
    const user = await client.hGetAll(userKey(id))

    // deserialize and return the hash 
    return deserialize(id, user)
};

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(userKey(id));

    return deserialize(id, user)
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId()

    // See if the username is already in the sets of usernames 
    const exist = await client.sAdd(usernamesUniqueKey(), attrs.username)
    // If it is throw error
    if (exist) {
        throw new Error('Username already exists')
    }
    // otherwise, continue

    await client.hSet(userKey(id), serialize(attrs))
    await client.sAdd(usernamesUniqueKey(), attrs.username)
    await client.zAdd(usernamesKey(), {
        value: attrs.username,
        score: parseInt(id, 16)

    })
    return id
};

const serialize = (user: CreateUserAttrs) => {
    return {
        username: user.username,
        password: user.password,
    }
}

const deserialize = (id: string, user: { [key: string]: string }) => {
    return {
        id,
        username: user.username,
        password: user.password,
    }
}