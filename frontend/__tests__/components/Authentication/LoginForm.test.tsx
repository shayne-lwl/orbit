import LoginForm from "@/app/components/LoginForm/LoginForm";
import { render, screen } from "@testing-library/react";
import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import React from "react";
import userEvent from "@testing-library/user-event";

describe("Login Form", () => {
  beforeEach(() => {
    const mockToggleSelection = jest.fn();
    const currentSelection = "registration";
    const mockRef = React.createRef<HTMLDivElement>();
    render(
      <LoginForm
        toggleSelection={mockToggleSelection}
        currentSelection={currentSelection}
        ref={mockRef}
      />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should generate Email and Password input field", () => {
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("should display Sign in and Register now button", () => {
    const buttons = screen.getAllByRole("button");
    for (let button of buttons) {
      expect(button).toBeInTheDocument();
    }
  });
});

describe("Register now button", () => {
  const mockToggleSelection = jest.fn();
  const currentSelection = "registration";
  const mockRef = React.createRef<HTMLDivElement>();
  const user = userEvent.setup();

  beforeEach(() => {
    render(
      <LoginForm
        toggleSelection={mockToggleSelection}
        currentSelection={currentSelection}
        ref={mockRef}
      />
    );
  });
  it("should toggle setSelection when clicked", async () => {
    const registerNowButton = screen.getByText("Register now");
    await user.click(registerNowButton);
    expect(mockToggleSelection).toHaveBeenCalledWith("Sign up");
  });

  describe("Input Fields", () => {
    it("should allow typing in Username and Password input fields", async () => {
      const emailInput = screen.getByPlaceholderText("Email");
      const passwordInput = screen.getByPlaceholderText("Password");

      await user.type(emailInput, "Shayne");
      await user.type(passwordInput, "Password@123");

      expect(emailInput).toHaveValue("Shayne");
      expect(passwordInput).toHaveValue("Password@123");
    });
  });
});
