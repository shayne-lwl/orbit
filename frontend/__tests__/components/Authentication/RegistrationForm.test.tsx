import RegistrationForm from "@/app/components/RegistrationForm/RegistrationForm";
import { render, screen } from "@testing-library/react";
import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import React from "react";
import userEvent from "@testing-library/user-event";

describe("Registration Form", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // to ensure very test starts with a clean state, with all original functin behaviors intact
  });

  beforeEach(() => {
    const mockToggleSelection = jest.fn();
    const currentSelection = "registration";
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

describe("Sign in button", () => {
  const currentSelection = "registration";
  const mockSetSelection = jest.fn();
  const mockToggleSelection = jest.fn(() => {
    mockSetSelection();
  });

  beforeEach(() => {
    render(
      <RegistrationForm
        toggleSelection={mockToggleSelection}
        currentSelection={currentSelection}
      />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should toggle setSelection when clicked", async () => {
    const signInButton = screen.getByText("Sign in");
    const user = userEvent.setup();
    await user.click(signInButton);

    expect(mockToggleSelection).toHaveBeenCalledWith("Sign in");
  });
});

describe("Input Fields", () => {
  const currentSelection = "registration";
  const mockSetSelection = jest.fn();
  const mockToggleSelection = jest.fn(() => {
    mockSetSelection();
  });
  beforeEach(() => {
    render(
      <RegistrationForm
        toggleSelection={mockToggleSelection}
        currentSelection={currentSelection}
      />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should allow typing in Username and Email fields", async () => {
    const user = userEvent.setup();
    const usernameInput = screen.getByPlaceholderText("Username");
    const emailInput = screen.getByPlaceholderText("Email");

    await user.type(usernameInput, "Shayne");
    await user.type(emailInput, "shayne.weiliang@gmail.com");

    expect(usernameInput).toHaveValue("Shayne");
    expect(emailInput).toHaveValue("shayne.weiliang@gmail.com");
  });

  it("should allow typing in Password and Confirm Password fields", async () => {
    const user = userEvent.setup();
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");

    await user.type(passwordInput, "Password@123");
    await user.type(confirmPasswordInput, "Password@123");

    expect(passwordInput).toHaveValue("Password@123");
    expect(confirmPasswordInput).toHaveValue("Password@123");
  });
});
