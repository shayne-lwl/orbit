import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import { render, screen } from "@testing-library/react";
import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";

describe("Navigation Bar (Not Authenticated)", () => {
  it("should render the correct elements: Explore, Donate,  orbit and Get Started button", () => {
    render(<NavigationBar />);

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
});
