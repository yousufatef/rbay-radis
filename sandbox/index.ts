import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    // clear out any pre-existing key with a conflicting type
    await client.del("car");

    await client.hSet("car", {
        color: "red",
        year: 2020,
        price: 20000,
        engine: { cylinders: 8 },
        owner: null,
        service: undefined
    });
    const car = await client.hGetAll("car");
    console.log(car);
};
run();