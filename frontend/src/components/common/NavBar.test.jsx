import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavBar from "./Navbar.jsx";

describe("NavBar Component", () => {
  it("renders all links", () => {
    render(<NavBar />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });

  it("navigates when a link is clicked", async () => {
    render(<NavBar />);
    const aboutLink = screen.getByText(/About/i);
    await userEvent.click(aboutLink);
    // If using react-router
    expect(window.location.pathname).toBe("/about");
  });
});
