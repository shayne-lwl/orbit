import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import { render, screen } from "@testing-library/react";
import { describe, it } from "@jest/globals";
import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom";

describe("Navigation Bar (Not Authenticated)", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl("/");
    render(
      <MemoryRouterProvider>
        <NavigationBar />
      </MemoryRouterProvider>
    );
  });

  it("should render the correct elements: Explore, Donate,  orbit and Get Started button", () => {
    // Duplicates of Explore and Donate due to Mobile Navigation Menu
    const exploreLinks = screen.getAllByText("Explore");
    const donateLinks = screen.getAllByText("Donate");

    expect(exploreLinks.length).toBeGreaterThan(0);
    expect(donateLinks.length).toBeGreaterThan(0);

    const orbit = screen.getByLabelText("orbitHomeLink");
    const getStarted = screen.getByText("Get Started");

    expect(orbit).toBeInTheDocument();
    expect(getStarted).toBeInTheDocument();
  });

  it("should navigate user to /register page when user clicks the Get Started button", async () => {
    const getStarted = screen.getByText("Get Started");
    const user = userEvent.setup();

    await user.click(getStarted);
    expect(mockRouter.asPath).toBe("/account");
  });
});
