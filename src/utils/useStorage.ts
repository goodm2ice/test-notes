import { useCallback, useEffect, useState } from 'react'

type StorageValue = object | string | number | boolean
type UseStorageReturn<T> = [T, (value: T | ((prev: T) => T)) => void, () => void]

function useStorage<T extends StorageValue>(key: string, defaultValue?: undefined): UseStorageReturn<T | undefined>
function useStorage<T extends StorageValue>(key: string, defaultValue: T): UseStorageReturn<T>
function useStorage<T extends StorageValue>(key: string, defaultValue?: T): UseStorageReturn<T | undefined> {
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        const raw = localStorage.getItem(key)
        if (raw !== null)
            try {
                setValue(JSON.parse(raw))
                return
            } catch (e) {
                localStorage.removeItem(key)
            }
        setValue(defaultValue)
    }, [key, defaultValue])

    const changeValue = useCallback((newValue: typeof value | ((prev: typeof value) => typeof value)) => {
        setValue((prev) => {
            const data = typeof newValue === 'function' ? newValue(prev) : newValue
            localStorage.setItem(key, JSON.stringify(data))
            return data
        })
    }, [key])

    const deleteValue = useCallback(() => {
        localStorage.removeItem(key)
        setValue(defaultValue)
    }, [key, defaultValue])

    return [value, changeValue, deleteValue]
}

export default useStorage
