import { render, screen, within } from "@testing-library/react";
import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

jest.mock("next/navigation", () => require("next-router-mock"));

describe("Home page content (Not Authenticated)", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
  });

  it("shoulder render the primary, secondary and tertiary slogan alongside with the 'Join now' button", () => {
    render(<Home />);
    const firstSlogan = screen.getByRole("heading", { level: 1 });
    const secondSlogan = screen.getByText("rbit it");
    const lastSlogan = screen.getByText(
      "Donate what you no longer need and find what you do"
    );

    const earthIcon = screen.getByAltText("Earth Icon");

    const joinNowButton = screen.getByTestId("Join now button");
    const buttonTextContent = within(joinNowButton).getByText("Join us now");

    const elements = [
      firstSlogan,
      secondSlogan,
      lastSlogan,
      earthIcon,
      joinNowButton,
      buttonTextContent,
    ];
    for (const element of elements) {
      expect(element).toBeInTheDocument();
    }
  });

  it("should navigate user to the /register page when 'Join us now' button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouterProvider>
        <Home />
      </MemoryRouterProvider>
    );

    const joinNowButton = screen.getByTestId("Join now button");
    await user.click(joinNowButton);
    expect(mockRouter.asPath).toBe("/account");
  });
});
