export interface Modal {
    open: boolean;
    title: string;
    message: string | { role?: string; avatar: string; name: string };
    type: "error" | "info" | "createProject" | "userProfile" | "DeleteWarning";
}
