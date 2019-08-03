import { persistenceConstants } from '../../config/constants';

const localStorageStrategyImpl = (() => {
    /**
     * This strategy is based on the ideas presented by this grubhub publication:
     *      https://bytes.grubhub.com/localstorage-design-patterns-and-passive-expiration-ffe86a539b15
     */

    // 1. Check the last access time and remove all expired tiers.
    // 2. Read the indices into memory.
    // 3. Define private methods such as (readKeysIntoMemory, writeKeysToStorage, readLastAccessTime, setLastAccessTime, etc.).
    // 4. Define public methods such as (get, set, remove, reset).
    // 5. Return the exposed public methods.

    // read the previously stored keys into memory
    const privateProps = {
        index: {},
        lastAccessed: 0
    };
    console.log(`localStorageStrategyImpl ${JSON.stringify(privateProps)}`);
    const readKeysIntoMemory = (privateProps) => {
        try {
            // key = name of item stored
            // value = tier number
            privateProps.index = JSON.parse(localStorage.getItem(persistenceConstants.INDEX_KEY)) || {};
        } catch (err) {
            console.error('Encountered an error while trying to read keys into memory.', err);
        }
    };
    const writeKeysToStorage = (privateProps) => {
        try {
            localStorage.setItem(persistenceConstants.INDEX_KEY, JSON.stringify(privateProps.index));
        } catch (err) {
            console.error('Encountered an error while writing keys to localStorage.', err);
        }
    };
    const readLastAccessTime = () => JSON.parse(localStorage.getItem(persistenceConstants.LAST_ACCESSED_KEY) || '0');
    const setLastAccessTime = (privateProps) => {
        privateProps.lastAccessed = Date.now();
        localStorage.setItem(persistenceConstants.LAST_ACCESSED_KEY, JSON.stringify(privateProps.lastAccessed));
    };
    const conditionallyClearItem = (privateProps, key, tier, elapsedMilliseconds) => {
        switch (tier) {
            case persistenceConstants.TIER_A:
                if (elapsedMilliseconds > persistenceConstants.EXPIRATION_MILLISECONDS_TIER_A) {
                    localStorage.removeItem(key);
                    delete privateProps.index[key];
                }
                break;
            case persistenceConstants.TIER_B:
                if (elapsedMilliseconds > persistenceConstants.EXPIRATION_MILLISECONDS_TIER_B) {
                    localStorage.removeItem(key);
                    delete privateProps.index[key];
                }
                break;
            case persistenceConstants.TIER_C:
                if (elapsedMilliseconds > persistenceConstants.EXPIRATION_MILLISECONDS_TIER_C) {
                    localStorage.removeItem(key);
                    delete privateProps.index[key];
                }
                break;
            case persistenceConstants.TIER_D:
                if (elapsedMilliseconds > persistenceConstants.EXPIRATION_MILLISECONDS_TIER_D) {
                    localStorage.removeItem(key);
                    delete privateProps.index[key];
                }
                break;
            case persistenceConstants.TIER_E:
                if (elapsedMilliseconds > persistenceConstants.EXPIRATION_MILLISECONDS_TIER_E) {
                    localStorage.removeItem(key);
                    delete privateProps.index[key];
                }
                break;
            default:
                console.warn(`Undefined tier '${tier}' specified for key '${key}'.`);
                return null;
        }
    };
    const clearExpired = (privateProps) => {
        const now = Date.now();
        // lastAccessed is maintained in memory prior to the first invocation of this method
        const elapsedMilliseconds = now - privateProps.lastAccessed;
        console.log(`clearExpired ${JSON.stringify(privateProps)}`);
        // build the key collection one tier at a time
        let keys = Object.keys(privateProps.index);
        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];
            const tier = privateProps.index[currentKey];
            conditionallyClearItem(privateProps, currentKey, tier, elapsedMilliseconds);
        }
    };

    // invoke the read keys method and clear the expired ones
    privateProps.lastAccessed = readLastAccessTime();
    readKeysIntoMemory(privateProps);
    clearExpired(privateProps);

    const get = (privateProps, key) => {
        const tier = privateProps.index[key];
        const now = Date.now();
        // lastAccessed is maintained in memory prior to the first invocation of this method
        const elapsedMilliseconds = now - privateProps.lastAccessed;
        conditionallyClearItem(privateProps, key, tier, elapsedMilliseconds);
        setLastAccessTime(privateProps);
        return JSON.parse(localStorage.getItem(key));
    };
    const set = (privateProps, key, value, tier = persistenceConstants.TIER_E) => {
        privateProps.index[key] = tier;
        localStorage.setItem(key, JSON.stringify(value));
        setLastAccessTime(privateProps);
        writeKeysToStorage(privateProps);
    };
    const remove = (privateProps, key) => {
        delete privateProps.index[key];
        localStorage.removeItem(key);
        setLastAccessTime(privateProps);
        writeKeysToStorage(privateProps);
    };
    const reset = (privateProps, tier) => {
        const keys = Object.keys(privateProps.index);
        for (let i = 0; i < keys.length; i++) {
            const currentKey = keys[i];
            const currentTier = privateProps.index[currentKey];
            if (currentTier < tier) continue;
            // pass in the maximum value of elapsed milliseconds plus one to ensure that the item is deleted
            // the tier passed into the method doesn't matter, but use the input parameter anyway
            conditionallyClearItem(privateProps, currentKey, tier, persistenceConstants.EXPIRATION_MILLISECONDS_TIER_A + 1);
        }
    };

    // expose the public methods
    const clientStorageInstance = {
        'get': (key) => get(privateProps, key),
        'set': (key, value, tier) => set(privateProps, key, value, tier),
        'remove': (key) => remove(privateProps, key),
        'reset': (tier) => reset(privateProps, tier),
    };

    return clientStorageInstance;
})();

const cookieCrumbStorageStrategyImpl = (() => {
    /**
     * This strategy is based on the ideas presented by this grubhub publication:
     *      https://bytes.grubhub.com/when-localstorage-fails-a-tale-of-cookies-and-crumbs-8be0e5044aeb
     * 
     * Note that cookie storage and reads are terribly inefficient, since it's effectively a linear traversal
     * of a linked list.  So, all reads will take place from the in-memory representation, with the exception
     * of initialization.  Writes still have to happen with each 'set' action.
     */

    // 1. Check the last access time and remove all expired tiers.
    // 2. Read the indices into memory.
    // 3. Define private methods such as (readKeysIntoMemory, writeKeysToStorage, readLastAccessTime, setLastAccessTime, etc.).
    // 4. Define public methods such as (get, set, remove, reset).
    // 5. Return the exposed public methods.

    // read the previously stored keys into memory
    const privateProps = {
        index: {},
        inMemoryStorage: {},
        lastAccessed: 0,
        crumbPrefix: 'crumbled_',
    };
    const gatherCrumbs = (privateProps, crumbledCookieStore, restoredKeys) => {
        for (let key in restoredKeys) {
            let sortedCrumbKeys = restoredKeys[key].sort();
            let nextCrumbKey = null;
            let unparsedValue = '';
            while (nextCrumbKey = sortedCrumbKeys.shift()) {
                unparsedValue += crumbledCookieStore[nextCrumbKey];
            }
            if (key === persistenceConstants.INDEX_KEY) {
                privateProps.index = JSON.parse(decodeURIComponent(unparsedValue));
            } else {
                privateProps.inMemoryStorage[key] = JSON.parse(decodeURIComponent(unparsedValue));
            }
        }
    };
    const readKeysIntoMemory = (privateProps) => {
        try {
            // key = name of item stored
            // value = tier number
            const cookies = document.cookie;
            const tempStore = {};
            const restoredKeys = {};
            cookies.split(/;[ ]?/).forEach((keyValPair) => {
                const [key, value] = keyValPair.split('=');
                if (key.indexOf(privateProps.crumbPrefix) !== -1) {
                    tempStore[key] = value;
                    // strip away the prefix and crumb serial number
                    const strippedKey = key.substr(key.indexOf(privateProps.crumbPrefix)).split('-')[0];
                    // maintain as the value for the stripped key, the associated collection of
                    // keys for the cookie store
                    if (!!restoredKeys[strippedKey]) {
                        restoredKeys[strippedKey].push(key);
                    } else {
                        restoredKeys[strippedKey] = [key];
                    }
                }
            });
            gatherCrumbs(privateProps, tempStore, restoredKeys);
        } catch (err) {
            console.error('Encountered an error while trying to read keys into memory.', err);
        }
    };
    const crumbleKeyValPairs = (keyValPairs) => {
        const newKeyValPairs = {};
        for (let key in keyValPairs) {
            const leftKey = key + '0';
            const rightKey = key + '1';
            const value = keyValPairs[key]
            newKeyValPairs[leftKey] = value.slice(0, value.length / 2);
            newKeyValPairs[rightKey] = value.slice(value.length / 2);
        }
        return newKeyValPairs;
    };
    const writeKeysToStorage = (privateProps) => {
        // need a helper function to map number of crumbs (1, 2, 4, 8, etc.) => binary string ('', '1', '11', '111', etc.)
        try {
            // localStorage.setItem(persistenceConstants.INDEX_KEY, JSON.stringify(index));
            const initialCookieKey = `${privateProps.crumbPrefix}${persistenceConstants.INDEX_KEY}-`;
            const expirationMilliseconds = Date.now() + persistenceConstants.EXPIRATION_MILLISECONDS_TIER_A;
            const expirationDate = new Date(expirationMilliseconds);
            let crumbledKeyValuePairs = { [initialCookieKey]: encodeURIComponent(JSON.stringify(privateProps.index)) };
            for (let attemptsToWrite = 0; attemptsToWrite < persistenceConstants.MAX_COOKIE_WRITE_ATTEMPTS; attemptsToWrite++) {
                try {
                    for (let crumbleKey in crumbledKeyValuePairs) {
                        const crumbleVal = crumbledKeyValuePairs[crumbleKey];
                        document.cookie = `${crumbleKey}=${crumbleVal};expires=${expirationDate.toUTCString()};path=/`
                    }
                } catch (err) {
                    console.warn(`Attempt ${attemptsToWrite+1} of ${persistenceConstants.MAX_COOKIE_WRITE_ATTEMPTS} to write index to storage failed.`, err);
                    crumbledKeyValuePairs = crumbleKeyValPairs(crumbledKeyValuePairs);
                }
            }
        } catch (err) {
            console.error('Encountered an error while writing keys to cookie storage.', err);
        }
    };
    const readLastAccessTime = () => {
        const cookies = document.cookie;
        let parsedLastAccessedTime = 0;
        cookies.split(/;[ ]?/).forEach((keyValPair) => {
            const [key, value] = keyValPair.split('=');
            if (key.indexOf(persistenceConstants.LAST_ACCESSED_KEY) !== -1) {
                parsedLastAccessedTime = JSON.parse(value);
            }
        });
        return parsedLastAccessedTime;
    };
    const setLastAccessTime = (privateProps) => {
        const expirationMilliseconds = Date.now() + persistenceConstants.EXPIRATION_MILLISECONDS_TIER_A;
        const expirationDate = new Date(expirationMilliseconds);
        privateProps.lastAccessed = Date.now();
        document.cookie = `${persistenceConstants.LAST_ACCESSED_KEY}=${JSON.stringify(privateProps.lastAccessed)};expires=${expirationDate.toUTCString()};path=/`
    };

    // invoke the read keys method and clear the expired ones
    privateProps.lastAccessed = readLastAccessTime();
    readKeysIntoMemory(privateProps);

    const get = (privateProps, key) => {
        // lastAccessed is maintained in memory prior to the first invocation of this method
        setLastAccessTime(privateProps);
        return privateProps.inMemoryStorage[key];
    };
    const set = (privateProps, key, value, tier = persistenceConstants.TIER_E) => {
        privateProps.index[key] = tier;
        privateProps.inMemoryStorage[key] = value;
        setLastAccessTime(privateProps);
        writeKeysToStorage(privateProps);
    };
    const remove = (privateProps, key) => {
        delete privateProps.index[key];
        delete privateProps.inMemoryStorage[key];
        const longPastExpiredDate = new Date(1970, 1, 1, 0, 0, 0, 0);
        const cookies = document.cookie;
        cookies.split(/;[ ]?/).forEach((keyValPair) => {
            const crumbKey = keyValPair.split('=')[0];
            const keyPrefix = privateProps.crumbPrefix + key;
            if (crumbKey.indexOf(keyPrefix) !== -1) {
                document.cookie = `${key}=;expires=${longPastExpiredDate.toUTCString()};path=/`;
            }
        });
        setLastAccessTime(privateProps);
        writeKeysToStorage(privateProps);
    };
    const reset = (privateProps, tier) => {
        const longPastExpiredDate = new Date(1970, 1, 1, 0, 0, 0, 0);
        const cookies = document.cookie;
        cookies.split(/;[ ]?/).forEach((keyValPair) => {
            const crumbKey = keyValPair.split('=')[0];
            if (crumbKey.indexOf(privateProps.crumbPrefix) !== -1) {
                const strippedKey = crumbKey.substr(crumbKey.indexOf(privateProps.crumbPrefix)).split('-')[0];
                if (tier >= privateProps.index[strippedKey]) {
                    // zero out the value and set the expiration date to the epoch value
                    // the browser will handle removing the cookie
                    document.cookie = `${crumbKey}=;expires=${longPastExpiredDate.toUTCString()};path=/`;
                }
            }
        });
    };

    // expose the public methods
    const clientStorageInstance = {
        'get': (key) => get(privateProps, key),
        'set': (key, value, tier) => set(privateProps, key, value, tier),
        'remove': (key) => remove(privateProps, key),
        'reset': (tier) => reset(privateProps, tier),
    };

    return clientStorageInstance;
})();

const clientStorage = (() => {
    const strategy = (() => {
        const testKey = 'storage_strategy_test';
        const testValue = 'dummy val';
        let writeSuccessful = false;

        try {
            localStorage.setItem(testKey, JSON.stringify(testValue));
            const retrievedValue = JSON.parse(localStorage.getItem(testKey));

            if (retrievedValue === testValue)
                writeSuccessful = true;

            localStorage.removeItem(testKey);
        } catch (err) {
            console.warn(`The test write for ${persistenceConstants.LOCAL_STORAGE_STRATEGY} failed. Falling back to ${persistenceConstants.COOKIE_CRUMB_STRATEGY}.`);
        }

        return writeSuccessful
            ? localStorageStrategyImpl
            : cookieCrumbStorageStrategyImpl;
    })();

    const clientStorageInstance = {
        'get': strategy.get,
        'set': strategy.set,
        'remove': strategy.remove,
        'reset': strategy.reset,
    };

    return clientStorageInstance;
})();

export default clientStorage;
