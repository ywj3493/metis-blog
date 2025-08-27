import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TestInputForm } from "@/mocks/components/TestInputForm";

describe("MockingTest in client", () => {
  it("should render correctly", async () => {
    const testInputForm = render(<TestInputForm />);
    expect(testInputForm).toMatchSnapshot();
  });

  it("should input correctly", async () => {
    render(<TestInputForm />);
    const nameInput = screen.getByPlaceholderText("name");
    const ageInput = screen.getByPlaceholderText("age");
    const postButton = screen.getByText("POST");

    await userEvent.type(nameInput, "김영수");
    await userEvent.type(ageInput, "2");
    await userEvent.click(postButton);

    const item = screen.getByText("사번: 1");
    expect(item).toBeInTheDocument();

    const deleteButton = screen.getByText("delete");

    await userEvent.click(deleteButton);
    expect(item).not.toBeInTheDocument();
  });
});
