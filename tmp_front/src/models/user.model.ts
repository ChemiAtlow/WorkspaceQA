export interface UserModel {
    projects: UserProjectModel[];
    _id: string;
    name: string;
    username: string;
}

export interface UserProjectModel {
    _id: string;
    name: string;
    owner: string;
    //users: ProjectsUsers[];
}

// interface ProjectsUsers {
//     id: string;
//     role: "Owner" | "Admin" | "User";
// }
