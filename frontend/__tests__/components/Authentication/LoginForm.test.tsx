import LoginForm from "@/app/components/LoginForm/LoginForm";
import { render, screen } from "@testing-library/react";
import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import React from "react";

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
