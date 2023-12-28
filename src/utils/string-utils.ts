export function a2b(s: string): string {
    const urlUnsafeString = s.replace(/_/g, "/").replace(/-/g, "+");
    if (typeof window !== "undefined") {
        //Favour atob in browser
        if (typeof atob !== "undefined") {
            return atob(urlUnsafeString);
        }
        if (typeof Buffer !== "undefined") {
            const buf = new Buffer(urlUnsafeString, "base64");
            return buf.toString("latin1");
        }
    } else {
        if (typeof Buffer !== "undefined") {
            const buf = new Buffer(urlUnsafeString, "base64");
            return buf.toString("latin1");
        }
        if (typeof atob !== "undefined") {
            return atob(urlUnsafeString);
        }
    }
    throw new Error("Unsupported operation a2b");
}