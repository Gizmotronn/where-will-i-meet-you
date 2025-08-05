export function getUserId(): string {
    const stored = localStorage.getItem('kafe-user-id');
    if (stored) {
        return stored;
    };

    const newId = crypto.randomUUID();
    localStorage.setItem('kafe-user-id', newId);
    return newId;
};

export function clearUser(): void {
    localStorage.removeItem('kafe-user-id');
};