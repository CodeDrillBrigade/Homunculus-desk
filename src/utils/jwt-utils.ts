import { a2b } from "./string-utils";

export function isJwtInvalidOrExpired(jwt: string): boolean {
    return getJwtExpirationMillis(jwt) < new Date().getTime();
}

export function getJwtExpirationMillis(jwt: string): number {
    const parts = jwt.split(".");
    if (parts.length !== 3) {
        return 0;
    }
    const payload = JSON.parse(a2b(parts[1]));
    // Using the 'exp' string is safe to use as it is part of the JWT RFC and cannot be modified by us.
    return ("exp" in payload) && !isNaN(+payload["exp"]) ? payload["exp"] * 1000 : 0
}
