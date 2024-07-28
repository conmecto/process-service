import logger from './logger';
import { cacheClient } from './cache';
import { enums } from '../utils';

const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';

const neighbor =  {
    n: [ 'p0r21436x8zb9dcf5h7kjnmqesgutwvy', 'bc01fg45238967deuvhjyznpkmstqrwx' ],
    s: [ '14365h7k9dcfesgujnmqp0r2twvyx8zb', '238967debc01fg45kmstqrwxuvhjyznp' ],
    e: [ 'bc01fg45238967deuvhjyznpkmstqrwx', 'p0r21436x8zb9dcf5h7kjnmqesgutwvy' ],
    w: [ '238967debc01fg45kmstqrwxuvhjyznp', '14365h7k9dcfesgujnmqp0r2twvyx8zb' ],
};

const border = {
    n: [ 'prxz',     'bcfguvyz' ],
    s: [ '028b',     '0145hjnp' ],
    e: [ 'bcfguvyz', 'prxz'     ],
    w: [ '0145hjnp', '028b'     ],
};

const adjacent = (geohash: string, direction: string) => {
    let lastChar = geohash.slice(-1);
    let parent = geohash.slice(0, -1);
    let type = geohash.length % 2;
    if (border[direction][type].indexOf(lastChar) !== -1 && parent.length) {
        parent = adjacent(parent, direction);
    }
    const neighborIndex = neighbor[direction][type].indexOf(lastChar);
    const neighborChar = base32.charAt(neighborIndex);
    return parent + neighborChar;
}

const findNearbyUsers = async (userId: number, geohash: string, searchArea: string) => {
    try {
        const users: {
            [key: string]: string
        } = {};
        const closeUserIds = await getUsersByGeohash(geohash, userId);
        closeUserIds.forEach(id => {
            users[id] = geohash;
        });
        if (searchArea === enums.SearchArea.CLOSE) {
            return users;
        }  
        const nearbyLoc = {
            'n':  adjacent(geohash, 'n'),
            'ne': adjacent(adjacent(geohash, 'n'), 'e'),
            'e':  adjacent(geohash, 'e'),
            'se': adjacent(adjacent(geohash, 's'), 'e'),
            's':  adjacent(geohash, 's'),
            'sw': adjacent(adjacent(geohash, 's'), 'w'),
            'w':  adjacent(geohash, 'w'),
            'nw': adjacent(adjacent(geohash, 'n'), 'w'),
        };
        if (searchArea === enums.SearchArea.MID) {
            for(const key in nearbyLoc) {
                if (nearbyLoc[key]) {
                    const midUserIds = await getUsersByGeohash(nearbyLoc[key], userId);
                    midUserIds.forEach(id => {
                        users[id] = geohash;
                    });
                }
            }
            return users;
        }
        const geohashes = new Set<string>();
        for(const key in nearbyLoc) {
            const nearbyGeohash = nearbyLoc[key];
            if (nearbyGeohash) {
                geohashes.add(nearbyGeohash);
                const secondLayerNearby = {
                    'n':  adjacent(nearbyGeohash, 'n'),
                    'ne': adjacent(adjacent(nearbyGeohash, 'n'), 'e'),
                    'e':  adjacent(nearbyGeohash, 'e'),
                    'se': adjacent(adjacent(nearbyGeohash, 's'), 'e'),
                    's':  adjacent(nearbyGeohash, 's'),
                    'sw': adjacent(adjacent(nearbyGeohash, 's'), 'w'),
                    'w':  adjacent(nearbyGeohash, 'w'),
                    'nw': adjacent(adjacent(nearbyGeohash, 'n'), 'w'),
                };
                for(const secondLayerKey in secondLayerNearby) {
                    const secondLayerNearbyGeohash = secondLayerNearby[secondLayerKey];
                    if(secondLayerNearbyGeohash) {
                        geohashes.add(secondLayerNearbyGeohash);
                    }
                }
            }
        }
        for (const key of geohashes) {
            if (key) {
                const distantUserIds = await getUsersByGeohash(key, userId);
                distantUserIds.forEach(id => {
                    users[id] = geohash;
                });
            }
        }
        return users;
    } catch(error) {
        await logger('Find near by users' + error?.toString());
    }
}

const getUsersByGeohash = async (geohash: string, exceptedUserId?: number) => {
    try {
        const userIds = await cacheClient.SMEMBERS(geohash);
        if (exceptedUserId) {
            return userIds.filter(id => Number(id) !== exceptedUserId);        
        }
        return userIds;
    } catch(error: any) {
        await logger('Get users by Geohash' + error?.toString());
    }
    return [];
}

export { findNearbyUsers }