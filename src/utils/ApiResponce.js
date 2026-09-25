class ApiResponce {
    constructor(statusCode, message = "success", data) {
      this.statusCode = statusCode; // 200, 201, 400, 404, 500
      this.message = message; // success, error, not found, internal server error
      this.data = data; // data returned
      this.success = statusCode < 400; // true if status code is less than 400
    }
  }
  
  export { ApiResponce };