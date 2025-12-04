import React from "react";
export default function App() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Website in Opbouw👷🏗️🔨</h1>
      <img
        src="/top2000logo.png"
        alt="Top2000 Logo"
        style={{ width: "200px", height: "auto", marginBottom: "1rem" }}
      />
      <p className="text-lg max-w-md">
        De Top2000-site wordt op dit moment gebouwd.
      </p>
      <p className="text-md mt-4 text-gray-600">🚧Kom later gerust terug!🚧</p>
    </div>
  );
}
