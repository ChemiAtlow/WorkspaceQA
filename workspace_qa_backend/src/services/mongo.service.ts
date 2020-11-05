import { connect } from 'mongoose';
import {
    AnswerNotFoundException,
    BadRequestException,
    ProjectNotFoundException,
    QuestionNotFoundException,
} from '../exceptions';
import { IProjectDocumnet, IQuestionDocumnet, IResponseDocumnet } from '../models/DB/interfaces';
import { projectModel, questionModel, responseModel, userModel } from '../models/DB/schemas';
import { CreateProjectDto, CreateQuestionDto, RateDto, ResponseDto } from '../models/dtos';
import { Rating } from '../models/interfaces';
import { appLogger } from './appLogger.service';

export const mongoDBConnect = async () => {
    const { MONGO_USER, MONGO_PASS, MONGO_PATH } = process.env;
    try {
        await connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}${MONGO_PATH}`, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        appLogger.debug('Connected to mongo!!!');
    } catch (error) {
        appLogger.error('Could not connect to MongoDB', error);
    }
};

export const isUserFromProject = ({ projects }: Express.User, projectId: string) =>
    projects.some((prj) => prj._id.equals(projectId));

export const isUserProjectOwner = async (projectId: string, { _id }: Express.User) => {
    const project = await projectModel.findOne({
        _id: projectId,
        archived: { $ne: true },
    });
    if (!project) {
        throw new ProjectNotFoundException(projectId);
    }
    return _id.equals(project.owner) ? project : false;
};

export const isUserResponseOwner = ({ user }: IResponseDocumnet, { _id }: Express.User) =>
    user._id.equals(_id) as boolean;

export const createProject = async (data: CreateProjectDto, owner: Express.User) => {
    const project = new projectModel({ ...data, owner });
    const userUpdate = owner.updateOne({ $push: { projects: project } }).exec();
    await Promise.all([project.save(), userUpdate]);
    return project;
};

export const createResponse = ({ message }: ResponseDto, { _id, name, avatar }: Express.User) => {
    const response = new responseModel({
        message,
        revisions: [],
        ratings: {
            votes: [],
        },
        user: {
            _id,
            name,
            avatar,
        },
    });
    return response;
};

export const createQuestion = (
    projectId: string,
    { title, filePath }: CreateQuestionDto,
    questionResponse: IResponseDocumnet
) => {
    const question = new questionModel({
        title,
        filePath,
        project: projectId,
        question: questionResponse,
        answers: [],
    });
    return question;
};

export const getProjectsOfUser = async (user: Express.User) => {
    await user.populate('projects').execPopulate();
    return { ...user.toObject(), accessToken: undefined, email: undefined, githubId: undefined };
};

export const getDataProjectLevel = async (projectId: string) => {
    const project = await projectModel.findOne({ _id: projectId, archived: { $ne: true } }).exec();
    if (!project) {
        throw new ProjectNotFoundException(projectId);
    }
    const questionsFetch = questionModel
        .find({ project: { $eq: projectId } })
        .populate('question', 'ratings.total')
        .select('_id title state answers')
        .exec();
    const usersFetch = userModel
        .find({ projects: project })
        .select('_id avatar name username')
        .exec();
    const [questions, users] = await Promise.all([questionsFetch, usersFetch]);
    return { ...project.toObject(), questions, users };
};

export const getQuestion = async (questionId: string) => {
    const questionDoc = await questionModel.findById(questionId).populate('question').exec();
    if (!questionDoc) {
        throw new QuestionNotFoundException(questionId);
    }
    return questionDoc;
};

export const getResponse = async (responseId: string) => {
    const answer = await responseModel.findById(responseId).exec();
    if (!answer) {
        throw new AnswerNotFoundException(responseId);
    }
    return answer;
};

export const getAnswers = async (questionId: string) => {
    const questionDoc = await questionModel
        .findById(questionId)
        .select('answers')
        .populate('answers')
        .exec();
    if (!questionDoc) {
        throw new QuestionNotFoundException(questionId);
    }
    return questionDoc.answers;
};

export const updateProject = async (data: CreateProjectDto, project: IProjectDocumnet) =>
    await project.updateOne({ ...data }).exec();

export const updateResponse = async (response: IResponseDocumnet, { message }: ResponseDto) => {
    const oldMsg = response.message;
    return await responseModel
        .findOneAndUpdate(
            { ...response.toObject() },
            { message, $push: { revisions: oldMsg }, edited: true },
            { new: true }
        )
        .exec();
};

export const updateQuestion = async (
    { message, filePath, title }: CreateQuestionDto,
    questionDoc: IQuestionDocumnet
) => {
    if (message) {
        questionDoc.question = await updateResponse(questionDoc.question, { message });
    }
    if (title || filePath) {
        questionDoc.title = title;
        questionDoc.filePath = filePath || questionDoc.filePath;
        await questionDoc.updateOne({ ...questionDoc.toObject() }).exec();
    }
};

export const addAnswerToQuestion = async (questionId: string, answerDoc: IResponseDocumnet) => {
    const questionFetch = getQuestion(questionId);
    const [answer, question] = await Promise.all([answerDoc.save(), questionFetch]);
    await question.updateOne({ $push: { answers: answer } }).exec();
};

export const removeProject = async (project: IProjectDocumnet) => {
    const projectUpdate = project.updateOne({ archived: true });
    const usersUpdate = userModel
        .updateMany({ projects: project }, { $pullAll: { projects: [project] } })
        .exec();
    await Promise.all([projectUpdate, usersUpdate]);
};

export const rateResponse = async (
    response: IResponseDocumnet,
    { rating }: RateDto,
    user: Express.User
) => {
    let currentRating = response.ratings.total || 0;
    const oldVote = response.ratings.votes.find((vote) => vote.user.equals(user._id));
    if (rating === Rating.cancel) {
        if (!oldVote) {
            throw new BadRequestException("You can't unvote a response you never voted.");
        }
        currentRating = oldVote.vote === 'up' ? currentRating - 1 : currentRating + 1;
        await response
            .updateOne({ $pull: { 'ratings.votes': oldVote }, 'ratings.total': currentRating })
            .exec();
    } else {
        if (oldVote) {
            throw new BadRequestException("You can't vote a response you've already voted.");
        }
        if (rating === Rating.up) {
            currentRating++;
        } else if (rating === Rating.down) {
            currentRating--;
        }
        const vote = { user: user, vote: rating };
        await response
            .updateOne({ $push: { 'ratings.votes': vote }, 'ratings.total': currentRating })
            .exec();
    }
};
