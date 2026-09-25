// Higher-order function to wrap request handlers and handle async errors.
const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            // Await the execution of the request handler to handle async code
            await requestHandler(req, res, next);
        } catch (err) {
            // If an error occurs during the execution of the handler, pass it to the error handler middleware
            next(err);
        }
    };
};

export default asyncHandler; // Export the asyncHandler function for use in routes

