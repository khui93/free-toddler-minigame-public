import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BunnyGame } from "@/routes/games/count-critters";

vi.mock("@/lib/audio", () => ({ sounds: { correct: vi.fn(), wrong: vi.fn() } }));

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("visual bunny counting", () => {
  it("accepts the total immediately without tapping any bunny", () => {
    render(<BunnyGame max={10} />);
    const total = screen.getAllByRole("img", { name: "Bunny" }).length;
    const choices = within(screen.getByRole("group", { name: "Total choices" }));
    fireEvent.click(choices.getByRole("button", { name: String(total) }));
    expect(screen.getByRole("status", { name: "Correct answer" })).toBeInTheDocument();
  });
});