class ApiError extends Error {
    constructor(
      statusCode, // 400, 404, 500
      message = "An error occurred while processing your request.", // default error message
      errors = [], // array of errors (default: empty array)
      stack = "" // error stack (default: empty string)
    ) {
      super(message); // initialize the Error with the message
      this.statusCode = statusCode; // HTTP status code (e.g., 400, 404, 500)
      this.message = message; // error message
      this.errors = errors; // array of errors
      this.data = null; // optional data to be returned with the error response
  
      if (stack) {
        this.stack = stack; // if stack is provided, set it
      } else {
        Error.captureStackTrace(this, this.constructor); // capture stack trace if not provided
      }
    }
  }
  
  export default ApiError;