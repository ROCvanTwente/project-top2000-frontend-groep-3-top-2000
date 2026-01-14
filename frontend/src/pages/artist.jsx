import React, { useState } from "react";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { ListTile } from "../components/listTile";
import { Footer } from "../components/footer";
import "./artist.css";

const Artist = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const artistData = {
    name: "ARTIST NAME",
    image: "/example.png",
    website: "https://artistwebsite.com",
    wiki: "https://en.wikipedia.org/wiki/Music",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ligula erat, tempor a accumsan nec, finibus eget ipsum. Morbi suscipit finibus mauris, at finibus sapien suscipit ut. Integer ultricies enim in dolor pellentesque imperdiet. Mauris hendrerit sed diam sit amet sollicitudin. Aenean at iaculis mi. Nullam id turpis eu velit maximus laoreet eget quis ex. Nulla metus nisl, malesuada maximus diam id, laoreet commodo ligula.",
    amountOfSongs: 4,
    averagePosition: 722,
    highestPosition: 12,
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      
      <main>
        <div className="row mx-0">
          <div className="container-left col-6">
            <div className="image-container">
              <img
                src={artistData.image}
                alt={artistData.name}
                className="image-artist"
              ></img>
              <p className="artist-name">artist name</p>
            </div>
            <div className="links-container">
              <a href={artistData.website} className="link">
                eigen website
              </a>
              <a href={artistData.wiki} className="link">
                wiki
              </a>
            </div>
          </div>
          <div className="container-right col-6">
            <div className="artist-bio">
              <h2>Biografie</h2>
              <p>{artistData.bio}</p>
            </div>
            <div className="artist-positions">
              <p>Aantal liedjes dit jaar: {artistData.amountOfSongs}</p>
              <p>Gemiddelde positie dit jaar: {artistData.averagePosition}</p>
              <p>Hoogste notering dit jaar: {artistData.highestPosition}</p>
            </div>
            <div className="artist-song-list">
              <h2>Top 2000 nummers</h2>
              <div className="songs-listtiles">
                <ListTile
                  position={1}
                  imagePath="/example.png"
                  songName="Song name"
                  artistName="Artist"
                  trend={12}
                />
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
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Artist;
