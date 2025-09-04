// src/components/common/navbar/ProfileMenu.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileMenu from "./ProfileMenu";
import { vi } from "vitest";

describe("ProfileMenu Component", () => {
  it("renders Login when no user is logged in", () => {
    render(<ProfileMenu userFirstName={null} setShowProfileDropdown={vi.fn()} />);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("renders user name when userFirstName is provided", () => {
    render(<ProfileMenu userFirstName="Rahul" setShowProfileDropdown={vi.fn()} />);

    expect(screen.getByText("Hi, Rahul")).toBeInTheDocument();
  });

  it("calls setShowProfileDropdown when profile button is clicked", () => {
    const mockSetDropdown = vi.fn();

    render(<ProfileMenu userFirstName="Rahul" setShowProfileDropdown={mockSetDropdown} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockSetDropdown).toHaveBeenCalled();
  });

  it("renders Logout option when user is logged in", () => {
    render(<ProfileMenu userFirstName="Rahul" setShowProfileDropdown={vi.fn()} />);

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
