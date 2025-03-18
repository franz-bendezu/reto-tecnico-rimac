import { z } from "zod";
import { createSuccessResponse, createBadRequestResponse, createErrorResponse } from "../api-response.utils";
import { ResponseMessage } from "../../constants/api-response.constants";

describe("API Response Utilities", () => {
  describe("createSuccessResponse", () => {
    it("should create a success response with default status code", () => {
      const data = { message: "Success" };
      const response = createSuccessResponse(data);
      
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify(data)
      });
    });

    it("should create a success response with custom status code", () => {
      const data = { message: "Created" };
      const response = createSuccessResponse(data, 201);
      
      expect(response).toEqual({
        statusCode: 201,
        body: JSON.stringify(data)
      });
    });
  });

  describe("createBadRequestResponse", () => {

    it("should create a bad request ", () => {
      const response = createBadRequestResponse();
      
      expect(response).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: ResponseMessage.BAD_REQUEST,
          errors: undefined
        })
      });
    });


    it("should create a bad request response without errors", () => {
      const message = "Invalid data";
      const response = createBadRequestResponse(message);
      
      expect(response).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message,
          errors: undefined
        })
      });
    });

    it("should create a bad request response with errors", () => {
      const message = "Validation failed";
      const errors = ["Field 'name' is required", "Field 'age' must be a number"];
      const response = createBadRequestResponse(message, errors);
      
      expect(response).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message,
          errors
        })
      });
    });
  });

  describe("createErrorResponse", () => {
    it("should create a response for Zod validation errors", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number()
      });
      
      try {
        schema.parse({ name: 123, age: "invalid" });
        fail("Should have thrown");
      } catch (error) {
        const response = createErrorResponse(error);
        
        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body as string);
        expect(body.message).toBeDefined();
        expect(body.errors).toBeInstanceOf(Array);
      }
    });

    it("should create a 500 response for other errors", () => {
      const error = new Error("Unexpected error");
      const response = createErrorResponse(error);
      
      expect(response).toEqual({
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal server error"
        })
      });
    });
  });
});
