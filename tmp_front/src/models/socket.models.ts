import { ProjectsQuestion } from "./project.model";
import { UserProjectModel } from "./user.model";

export interface SocketProjects {
    action: "create" | "delete" | "rename";
    project: UserProjectModel;
}

export interface SocketQuestions {
    action: "create" | "edit";
    question: ProjectsQuestion & { project: string };
}
