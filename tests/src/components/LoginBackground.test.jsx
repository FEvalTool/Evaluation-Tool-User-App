import { render } from "@testing-library/react";
import { DynamicGradientBackground } from "../../../src/components/LoginBackground";

describe("DynamicGradientBackground", () => {
    // Test 1: Component render correctly
    it("should render SVG element", () => {
        const { container } = render(<DynamicGradientBackground />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });

    // Test 2: Correct ViewBox attribute
    it("should have correct viewBox attribute", () => {
        const { container } = render(<DynamicGradientBackground />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("viewBox", "0 0 1998 1125");
    });

    // Test 3: Width and Height are 100%
    it("should have 100% width and height", () => {
        const { container } = render(<DynamicGradientBackground />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("width", "100%");
        expect(svg).toHaveAttribute("height", "100%");
    });

    // Test 4: preserveAspectRatio
    it("should have preserveAspectRatio attribute", () => {
        const { container } = render(<DynamicGradientBackground />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("preserveAspectRatio", "xMidYMid slice");
    });

    // Test 5: SVG display style
    it("should have display block style", () => {
        const { container } = render(<DynamicGradientBackground />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveStyle({ display: "block" });
    });

    // Test 6: Default gradient colors
    it("should use default colors when not provided", () => {
        const { container } = render(<DynamicGradientBackground />);
        const stops = container.querySelectorAll("stop");

        expect(stops).toHaveLength(2);
        expect(stops[0]).toHaveStyle({ stopColor: "#4F46E5" });
        expect(stops[1]).toHaveStyle({ stopColor: "#9333EA" });
    });

    // Test 7: Custom gradient colors
    it("should apply custom gradient colors", () => {
        const { container } = render(
            <DynamicGradientBackground
                colorStart="#FCD34D"
                colorEnd="#EF4444"
            />,
        );
        const stops = container.querySelectorAll("stop");

        expect(stops[0]).toHaveStyle({ stopColor: "#FCD34D" });
        expect(stops[1]).toHaveStyle({ stopColor: "#EF4444" });
    });

    // Test 8: Gradient ID format
    it("should generate gradient ID based on colors", () => {
        const { container } = render(
            <DynamicGradientBackground
                colorStart="#FCD34D"
                colorEnd="#EF4444"
            />,
        );
        const gradient = container.querySelector("linearGradient");

        expect(gradient).toHaveAttribute("id", "gradient-#FCD34D-#EF4444");
    });

    // Test 9: Gradient direction - horizontal (default)
    it("should apply horizontal gradient direction", () => {
        const { container } = render(<DynamicGradientBackground />);
        const gradient = container.querySelector("linearGradient");

        expect(gradient).toHaveAttribute("x1", "0%");
        expect(gradient).toHaveAttribute("y1", "0%");
        expect(gradient).toHaveAttribute("x2", "100%");
        expect(gradient).toHaveAttribute("y2", "0%");
    });

    // Test 10: Gradient direction - vertical
    it("should apply vertical gradient direction", () => {
        const { container } = render(
            <DynamicGradientBackground gradientDirection="vertical" />,
        );
        const gradient = container.querySelector("linearGradient");

        expect(gradient).toHaveAttribute("x1", "0%");
        expect(gradient).toHaveAttribute("y1", "0%");
        expect(gradient).toHaveAttribute("x2", "0%");
        expect(gradient).toHaveAttribute("y2", "100%");
    });

    // Test 11: Gradient direction - diagonal
    it("should apply diagonal gradient direction by default", () => {
        const { container } = render(
            <DynamicGradientBackground gradientDirection="diagonal" />,
        );
        const gradient = container.querySelector("linearGradient");

        expect(gradient).toHaveAttribute("x1", "0%");
        expect(gradient).toHaveAttribute("y1", "0%");
        expect(gradient).toHaveAttribute("x2", "100%");
        expect(gradient).toHaveAttribute("y2", "100%");
    });

    // Test 12: Invalid gradient direction fallback
    it("should fallback to diagonal when invalid direction provided", () => {
        const { container } = render(
            <DynamicGradientBackground gradientDirection="invalid" />,
        );
        const gradient = container.querySelector("linearGradient");

        expect(gradient).toHaveAttribute("x1", "0%");
        expect(gradient).toHaveAttribute("y1", "0%");
        expect(gradient).toHaveAttribute("x2", "100%");
        expect(gradient).toHaveAttribute("y2", "100%");
    });

    // Test 13: Path element exists
    it("should contain path element with fill-rule", () => {
        const { container } = render(<DynamicGradientBackground />);
        const path = container.querySelector("path");

        expect(path).toBeInTheDocument();
        expect(path).toHaveAttribute("fill-rule", "evenodd");
    });

    // Test 14: Path uses gradient
    it("should reference gradient in path fill", () => {
        const { container } = render(
            <DynamicGradientBackground
                colorStart="#FCD34D"
                colorEnd="#EF4444"
            />,
        );
        const path = container.querySelector("path");

        expect(path).toHaveAttribute("fill", "url(#gradient-#FCD34D-#EF4444)");
    });

    // Test 15: Gradient stops offset
    it("should have correct gradient stops offset", () => {
        const { container } = render(<DynamicGradientBackground />);
        const stops = container.querySelectorAll("stop");

        expect(stops[0]).toHaveAttribute("offset", "0%");
        expect(stops[1]).toHaveAttribute("offset", "100%");
    });

    // Test 16: Gradient stops opacity
    it("should set stop opacity to 1", () => {
        const { container } = render(<DynamicGradientBackground />);
        const stops = container.querySelectorAll("stop");

        stops.forEach((stop) => {
            expect(stop).toHaveStyle({ stopOpacity: 1 });
        });
    });

    // Test 17: Defs element exists
    it("should contain defs element for gradient definition", () => {
        const { container } = render(<DynamicGradientBackground />);
        const defs = container.querySelector("defs");

        expect(defs).toBeInTheDocument();
    });

    // Test 18: Linear gradient exists
    it("should contain linearGradient element", () => {
        const { container } = render(<DynamicGradientBackground />);
        const gradient = container.querySelector("linearGradient");

        expect(gradient).toBeInTheDocument();
    });

    // Test 19: SVG namespace
    it("should have correct SVG namespace", () => {
        const { container } = render(<DynamicGradientBackground />);
        const svg = container.querySelector("svg");

        expect(svg).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
    });
});
