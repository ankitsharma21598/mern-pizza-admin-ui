import { describe, expect, test } from "vitest";
import LoginPage from "./login";
import { render, screen } from "@testing-library/react";
describe("Login", () => {
  test("should render login page with required fields", () => {
    // Arrange
    render(<LoginPage />);

    // getBy -> throws an error
    // queryBy -> returns null if not found
    // findBy ->  async

    // Act
    const heading = screen.getByText("Sign in");
    const emailInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /log in/i });
    const checkbox = screen.getByRole("checkbox", { name: "Remember me" });
    const forgotPasswordLink = screen.getByText("Forgot password?");

    // Assert
    expect(heading).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(loginButton).toBeDefined();
    expect(checkbox).toBeDefined();
    expect(forgotPasswordLink).toBeDefined();
  });
});
