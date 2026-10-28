import { describe, expect, it } from "vitest";
import { TimeoutError } from "./index";

describe("TimeoutError", () => {
  it("uses the default message", () => {
    expect(new TimeoutError().message).toBe("Operation timed out");
  });

  it("accepts a custom message", () => {
    expect(new TimeoutError("custom timeout").message).toBe("custom timeout");
  });

  it("sets the error name", () => {
    expect(new TimeoutError().name).toBe("TimeoutError");
  });

  it("is an instance of Error and TimeoutError", () => {
    const error = new TimeoutError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(TimeoutError);
  });

  it("serializes with its name and message", () => {
    expect(String(new TimeoutError())).toBe("TimeoutError: Operation timed out");
  });
});
