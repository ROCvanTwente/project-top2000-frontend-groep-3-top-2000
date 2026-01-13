import React, { useState } from "react";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { ListTile } from "../components/listTile";
import { Footer } from "../components/footer";
import { Carousel } from "../components/carousel";
import { Link } from "react-router-dom";

const carouselItems = [
  {
    image: "/example.png",
    href: "/",
    alt: "Description",
  },
  {
    image: "example.png",
    href: "/",
    alt: "Description 2",
  },
];

const Homepage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
        <Carousel items={carouselItems} carouselId="myCarousel" />
        <Link to="/song">
          <ListTile
            position={1}
            imagePath="/some/cover.jpg"
            songName="Song name"
            artistName="Artist"
            trend={12}
          />
        </Link>
        <ListTile
          position={2}
          imagePath="/some/cover.jpg"
          songName="Song name"
          artistName="Artist"
          trend={-12}
        />
        <ListTile
          position={3}
          imagePath="/some/cover.jpg"
          songName="Song name"
          artistName="Artist"
          trend={0}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
