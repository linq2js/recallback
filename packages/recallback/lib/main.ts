import { useState } from "react";

const createCacheItem = (cache: Map<any, any>) => {
  let currentCallback: Function;
  let currentGetKey: Function | undefined;

  return {
    /**
     * update currentCallback and currentGetKey with latest values
     * @param callback
     * @param getKey
     * @returns
     */
    update(callback: Function, getKey: Function | undefined) {
      currentCallback = callback;
      currentGetKey = getKey;
    },
    /**
     * execute callback
     * @param args
     * @returns
     */
    wrapper(...args: any[]) {
      const result = currentCallback(...args);
      // if the result is function, that means the input is callback factory
      // we should create a cache item for each key
      if (args.length && typeof result === "function") {
        // the key might be first argument or result of getKey()
        // user can use getKey() to serialize or generate hash code from list of arguments
        const key = currentGetKey ? currentGetKey(...args) : args[0];
        // create new cache item if not any
        let item = cache.get(key);
        if (!item) {
          item = createCacheItem(cache);
          cache.set(key, item);
        }
        item.update(result, currentGetKey);
        return item.wrapper;
      }
      return result;
    },
  };
};

/**
 * create a cached callback
 * @param callback
 * @param getKey
 * @returns
 */
const useCallback = <T extends (...args: any[]) => any>(
  callback: T,
  getKey?: (...args: Parameters<T>) => unknown
): T => {
  const item = useState(() => createCacheItem(new Map()))[0];
  item.update(callback, getKey);
  return item.wrapper as T;
};

export default useCallback;
