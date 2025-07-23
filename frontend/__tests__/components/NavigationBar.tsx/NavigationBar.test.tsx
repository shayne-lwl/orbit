import NavigationBar from "@/app/components/NavigationBar/NavigationBar";
import { render, screen } from "@testing-library/react";
import { describe, it } from "@jest/globals";
import "@testing-library/jest-dom";

describe("Navigation Bar", () => {
  it("should render the correct elements: Explore, Donate,  orbit and Get Started button", () => {
    render(<NavigationBar />);
    screen.debug();
  });
});
