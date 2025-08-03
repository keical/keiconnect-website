export function addToLocalStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage(key: string): string | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
}