import { describe, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Account from "@/app/account/page";
import userEvent from "@testing-library/user-event";

describe("Authentication Page", () => {
  beforeEach(() => {
    render(<Account />);
  });

  it("should display Registration and Login Form to the user", () => {
    const registrationFormHeader = screen.getByText("CREATE ACCOUNT");
    const loginFormHeader = screen.getByText("WELCOME BACK");
    expect(registrationFormHeader).toBeInTheDocument();
    expect(loginFormHeader).toBeInTheDocument();
  });
});

describe("Selection Container", () => {
  const mockSetSelection = jest.fn();
  const mockToggleSelection = jest.fn(() => {
    mockSetSelection();
  });

  beforeEach(() => {
    render(<Account />);
  });
  it("should toggle between RegistrationForm and LoginForm when either 'Register now' or 'Sign in' button is clicked", async () => {
    const user = userEvent.setup();
    const registrationForm = screen.getByTestId("registration-form-container");
    const loginForm = screen.getByTestId("login-form-container");

    // 1. Initial State: Registration is visible, Login is not.
    expect(registrationForm).not.toHaveClass("inactive");
    expect(loginForm).toHaveClass("inactive");

    // 2. Act: Click the "Sign in" button in the registration form.
    const signInButton = screen.getByTestId("Registration Form Sign in Button");
    await user.click(signInButton);

    // 3. Assert: Login is now visible, Registration is not.
    expect(registrationForm).toHaveClass("inactive");
    expect(loginForm).not.toHaveClass("inactive");

    // 4. Act: Click the "Register now" button in the login form.
    const registerNowButton = screen.getByRole("button", {
      name: /register now/i,
    });
    await user.click(registerNowButton);

    // 5. Assert: We're back to the initial state.
    expect(registrationForm).not.toHaveClass("inactive");
    expect(loginForm).toHaveClass("inactive");
  });
});
