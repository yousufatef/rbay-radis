import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {

    await client.hSet("car1", {
        color: "red",
        year: 2020
    });


    await client.hSet("car2", {
        color: "black",
        year: 2010
    });


    await client.hSet("car3", {
        color: "green",
        year: 2022
    });

    const results = await Promise.all([
        client.hGetAll("car1"),
        client.hGetAll("car2"),
        client.hGetAll("car3"),
    ])

    console.log(results)

};
run();