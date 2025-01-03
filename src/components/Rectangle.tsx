import { useState } from "react";
import { Rect, Text } from "react-konva";
import { Seat } from "../types/map";

export default function Rectangle({
  shapeProps,
  fill,
  showNames,
  isEditMapMode,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const seatColors: Record<FillColors, string[]> = {
    gray: ["#4b5563", "#6b7280", "#374151"], // Tailwind gray shades
    red: ["#ef4444", "#f87171", "#dc2626"], // Tailwind red shades
    green: ["#22c55e", "#4ade80", "#16a34a"], // Tailwind green shades
  };
  const gap = 5;
  return (
    <div
      onMouseEnter={() => setIsHovered(!isEditMapMode)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Chair backrest */}
      <Rect
        x={shapeProps.x + 3}
        y={shapeProps.y + 3}
        width={shapeProps.width - 6}
        height={shapeProps.height / 2} // The backrest is half the total height
        fill={seatColors[fill][0]} // Tailwind gray-600
        cornerRadius={[20, 20, 0, 0]} // Rounded top
        stroke={isHovered ? "black" : ""}
        strokeWidth={isHovered ? 2 : 0}
      />

      {/* Chair seat */}
      <Rect
        x={shapeProps.x}
        y={shapeProps.y + shapeProps.height / 2}
        width={shapeProps.width}
        height={shapeProps.height / 2}
        fill={seatColors[fill][1]} // Tailwind gray-600
        stroke={isHovered ? "black" : ""}
        cornerRadius={[10, 10, 0, 0]} // Rounded top for the seat
      />

      {/* Left armrest */}
      <Rect
        x={shapeProps.x - 5} // Adjust position for armrest to sit outside the seat
        y={shapeProps.y + shapeProps.height / 2}
        width={5}
        height={shapeProps.height / 2}
        stroke={isHovered ? "black" : ""}
        fill={seatColors[fill][2]} // Tailwind gray-600
        cornerRadius={5} // Rounded edges for armrest
      />

      {/* Right armrest */}
      <Rect
        x={shapeProps.x + shapeProps.width} // Position right armrest
        y={shapeProps.y + shapeProps.height / 2}
        width={5}
        height={shapeProps.height / 2}
        stroke={isHovered ? "black" : ""}
        fill={seatColors[fill][2]} // Tailwind gray-600
        cornerRadius={5} // Rounded edges for armrest
      />

      {/* Username text */}
      {shapeProps.userId && showNames && (
        <Text
          x={
            shapeProps.x + shapeProps.width / 1 - shapeProps.username.length * 2
          } // Centering the text horizontally
          y={shapeProps.y + shapeProps.height / 2 + 5} // Centering the text vertically
          text={shapeProps.username}
          rotation={180}
          fontSize={14}
          fill="black" // You can customize the color
          align="center"
          verticalAlign="middle"
        />
      )}
    </div>
  );
}

interface Props {
  shapeProps: Seat;
  fill: FillColors;
  showNames: boolean;
  isEditMapMode: boolean;
}
type FillColors = "green" | "red" | "gray";
