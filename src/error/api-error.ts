export class ApiError extends Error {
    private static readonly defaultMessage = 'Internal server error';
    private static readonly defaultStatusCode = 500;

    statusCode: number;

    constructor(
        message: string = ApiError.defaultMessage,
        statusCode: number = ApiError.defaultStatusCode
    ) {
        super(message);

        this.statusCode = statusCode;
    }
}