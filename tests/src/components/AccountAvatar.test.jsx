import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AccountAvatar } from "../../../src/components/AccountAvatar";
import * as colorUtils from "../../../src/utils/colorGenerator";

describe("AccountAvatar", () => {
    it("should render avatar image when avatarSrc is provided", () => {
        render(
            <AccountAvatar
                avatarSrc="https://example.com/avatar.png"
                username="john"
                size={200}
            />,
        );

        const avatarImage = screen.getByAltText("avatar");

        expect(avatarImage).toBeInTheDocument();
        expect(avatarImage).toHaveAttribute(
            "src",
            "https://example.com/avatar.png",
        );
    });

    it("should render username when avatarSrc is not provided", () => {
        render(<AccountAvatar avatarSrc={null} username="john" size={200} />);

        expect(screen.getByText("john")).toBeInTheDocument();
    });

    it("should apply background color generated from username", () => {
        const mockColor = "#123456";

        vi.spyOn(colorUtils, "stringToColour").mockReturnValue(mockColor);

        render(<AccountAvatar avatarSrc={null} username="john" size={200} />);

        const avatar = screen.getByText("john").closest(".ant-avatar");

        expect(avatar).toHaveStyle({
            backgroundColor: mockColor,
        });
    });

    it("should not render image when avatarSrc is missing", () => {
        render(
            <AccountAvatar avatarSrc={undefined} username="john" size={200} />,
        );

        expect(screen.queryByAltText("avatar")).not.toBeInTheDocument();
    });
});
