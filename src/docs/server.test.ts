import http from "http";
import { jest } from "@jest/globals";
import './server'

jest.mock("http" , () => {
    return {
        createServer: jest.fn().mockReturnValue({
            listen: jest.fn(),
            close: jest.fn()
        })
    }
});

describe("HTTP Server", () => {
    it("should call createServer", () => {
        expect(http.createServer).toHaveBeenCalled();
    });

    it("should call listen", () => {
        expect(http.createServer().listen).toHaveBeenCalled();
    });

    it("should call close", () => {
        process.emit("SIGINT");
        expect(http.createServer().close).toHaveBeenCalled();
    });
});