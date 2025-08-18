import { describe, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import Account from "@/app/account/page";

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
