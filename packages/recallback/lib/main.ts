import { useState } from "react";

const defaultGetKey = (...args: any[]) => args[0];

const createCacheItem = (cache: Map<any, any>, depth: number) => {
  let currentCallback: Function;
  let currentGetKey: Function;

  return {
    /**
     * invalidate currentCallback and currentGetKey with latest values
     * @param callback
     * @param getKey
     * @returns
     */
    invalidate(callback: Function, getKey: Function) {
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
      if (depth < 3 && typeof result === "function") {
        // the key might be first argument or result of getKey()
        // user can use getKey() to serialize or generate hash code from list of arguments or select which value is the key
        const key = currentGetKey(...args);
        // create new cache item if not any
        let item = cache.get(key);
        if (!item) {
          item = createCacheItem(cache, depth + 1);
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
  getKey: (...args: Parameters<T>) => unknown = defaultGetKey
) => {
  const item = useState(() => {
    const cache = new Map();
    const { invalidate, wrapper } = createCacheItem(cache, 1);
    return {
      invalidate,
      wrapper: Object.assign(wrapper as T, {
        cleanup() {
          cache.clear();
        },
      }),
    };
  })[0];
  item.invalidate(callback, getKey);
  return item.wrapper;
};

export default useCallback;
