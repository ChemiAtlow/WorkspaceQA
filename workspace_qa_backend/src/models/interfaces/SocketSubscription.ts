export interface SocketSubscription {
    user: string;
    projects: { _id: string }[];
}
export interface SocketSubscriptionAddRemove {
    type: 'project' | 'question';
    id: string;
}
