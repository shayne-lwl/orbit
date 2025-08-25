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

  it("should have input required validation rule for each field", async () => {
    const user = userEvent.setup();
    const signUpButton = screen.getByText("Sign up");

    await user.click(signUpButton);

    // Because React Hook Form triggers an asynchronous re-render after validation, we use findByText().
    // It returns a promise that resolves when the element is found and will fail if the element doesn't appear after a timeout.
    expect(await screen.findByText("Username is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Email address is required")
    ).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  it("should prevent user from inputting a username that is lesser than 5 characters and more than 15 characters", async () => {
    const user = userEvent.setup();
    const usernameInput = screen.getByPlaceholderText("Username");
    const signUpButton = screen.getByText("Sign up");

    await user.type(usernameInput, "Kai");
    await user.click(signUpButton);
    expect(
      await screen.findByText("Username must be at least 5 characters long")
    ).toBeInTheDocument();
    user.clear(usernameInput);

    await user.type(usernameInput, "AAAAAAAAAAAAAAAAAAAA");
    await user.click(signUpButton);
    expect(
      await screen.findByText("Username cannot be longer than 15 characters")
    ).toBeInTheDocument();
  });

  it("should prevent user from inputting an invalid email address", async () => {
    const user = userEvent.setup();
    const emailInput = screen.getByPlaceholderText("Email");
    const signUpButton = screen.getByText("Sign up");

    await user.type(emailInput, "12345@abc");
    await user.click(signUpButton);
    expect(
      await screen.findByText("Invalid email address")
    ).toBeInTheDocument();
  });

  const errorMessage =
    "Password must be 8 to 32 characters and include uppercase, lowercase, numbers, and symbols";
  const invalidPasswords = [
    { case: "only numbers", value: "12345678" },
    { case: "only lowercase", value: "abcdefgh" },
    { case: "only uppercase", value: "ABCDEFGH" },
    { case: "no special char", value: "Abcdef123" },
    { case: "no number", value: "Abcdefghi!" },
    { case: "no uppercase", value: "abcdef123!" },
    { case: "no lowercase", value: "ABCDEF123!" },
  ];

  it.each(invalidPasswords)(
    "should fail validation for passwords with $case", // $case is a placeholder syntax for the invalidPasswrod keys. The placeholder name must match with the key name
    async ({ value }) => {
      const user = userEvent.setup();
      const passwordInput = screen.getByPlaceholderText("Password");
      const signUpButton = screen.getByText("Sign up");

      await user.type(passwordInput, value);
      await user.click(signUpButton);

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    }
  );

  it("should validate Password and Confirm Password input value and ensure that the values are identical", async () => {
    const user = userEvent.setup();
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm Password");
    const signUpButton = screen.getByText("Sign up");

    await user.type(passwordInput, "!Password@123");
    await user.type(confirmPasswordInput, "!Password@12");

    await user.click(signUpButton);
    expect(
      await screen.findByText("Password do not match")
    ).toBeInTheDocument();
    user.clear(confirmPasswordInput);

    await user.type(confirmPasswordInput, "!Password@123");
    await user.click(signUpButton);
    expect(screen.queryByText("Password do not match")).not.toBeInTheDocument(); // Use queryBy methods to work with .not property
  });
});
