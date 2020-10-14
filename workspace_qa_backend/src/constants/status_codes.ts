export enum HTTPStatuses {
    ok = 200,
    empty = 204,
    clientError = 400,
    notFound = 404,
    unauthorized = 401,
    forbidden = 403,
    conflict = 409,
    internalServerError = 500,
    notImplemented = 501,
    iAmATeapot = 418,
    unprocessableEntityError = 422,
}
