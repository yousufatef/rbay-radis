import { userKey, usernamesUniqueKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';


export const getUserByUsername = async (username: string) => { };

export const getUserById = async (id: string) => {
    const user = await client.hGetAll(userKey(id));

    return deserialize(id, user)
};

export const createUser = async (attrs: CreateUserAttrs) => {
    const id = genId()

    // See if the usernam is already in the sets of usernames 
    const exist = await client.sAdd(usernamesUniqueKey(), attrs.username)
    // If it is throw error
    if (exist) {
        throw new Error('Username already exists')
    }
    // otherwise, continue

    await client.hSet(userKey(id), serialize(attrs))
    await client.sAdd(usernamesUniqueKey(), attrs.username)
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