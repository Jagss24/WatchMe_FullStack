// avatarGenerator.js
export function generateAvatar(text, size) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = size;
  canvas.height = size;
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
  context.fillStyle = "#3498db"; // Background color
  context.fill();
  context.closePath();
  context.font = `${size / 2}px Arial`;
  context.fillStyle = "#ffffff"; // Text color
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text.toUpperCase().charAt(0), size / 2, size / 2);
  const dataURL = canvas.toDataURL();
  return dataURL;
}
