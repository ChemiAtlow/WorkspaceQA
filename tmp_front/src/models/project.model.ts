export interface ProjectModel {
    _id: string;
    name: string;
    questions: ProjectsQuestion[];
    owner: string;
    users: ProjectsUsers[];
}

export interface ProjectsUsers {
    _id: string;
    name: string;
    username: string;
    avatar: string;
    // role: "Owner" | "Admin" | "User";
}

export interface ProjectsQuestion {
    _id: string;
    title: string;
    state: "New" | "Answered" | "Accepted" | "Closed";
    answerCount: number;
    question: {
        rating: number;
    };
}
