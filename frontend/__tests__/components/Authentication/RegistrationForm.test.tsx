import RegistrationForm from "@/app/components/RegistrationForm/RegistrationForm";
import { render, screen } from "@testing-library/react";
import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";

describe("Registration Form", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // to ensure very test starts with a clean state, with all original functin behaviors intact
  });

  beforeEach(() => {
    const mockToggleSelection = jest.fn();
    const currentSelection = "regsitration";
    render(
      <RegistrationForm
        toggleSelection={mockToggleSelection}
        currentSelection={currentSelection}
      />
    );
  });

  it("should render username, email, password and confirm password input field", () => {
    const usernameInputField = screen.getByPlaceholderText("Username");
    const emailInputField = screen.getByPlaceholderText("Email");
    const passwordInputField = screen.getByPlaceholderText("Password");
    const confirmPasswordInputField =
      screen.getByPlaceholderText("Confirm Password");

    const inputFields = [
      usernameInputField,
      emailInputField,
      passwordInputField,
      confirmPasswordInputField,
    ];

    for (const input of inputFields) {
      expect(input).toBeInTheDocument();
    }
  });

  it("should display Sign up and Sign in button to users", () => {
    const buttons = screen.getAllByRole("button");
    for (const button of buttons) {
      expect(button).toBeInTheDocument();
    }
  });
});
