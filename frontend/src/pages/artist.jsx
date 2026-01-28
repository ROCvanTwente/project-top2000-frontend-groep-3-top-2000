import React, { useState, useEffect, cacheSignal } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/navBar";
import { Sidebar } from "../components/sidebar";
import { ListTile } from "../components/listTile";
import { Footer } from "../components/footer";
import "./artist.css";
import { BASE_API_URL } from "../data/api-url";

const Artist = () => {
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [averagePosition, setAveragePosition] = useState(0);
  const [highestPosition, setHighestPosition] = useState(0); const [trendMap, setTrendMap] = useState({}); const [artistData, setArtistData] = useState({
    name: "ARTIST NAME",
    image: "/example.png",
    website: "https://artistwebsite.com",
    wiki: "https://en.wikipedia.org/wiki/Music",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ligula erat, tempor a accumsan nec, finibus eget ipsum. Morbi suscipit finibus mauris, at finibus sapien suscipit ut. Integer ultricies enim in dolor pellentesque imperdiet. Mauris hendrerit sed diam sit amet sollicitudin. Aenean at iaculis mi. Nullam id turpis eu velit maximus laoreet eget quis ex. Nulla metus nisl, malesuada maximus diam id, laoreet commodo ligula.",
    amountOfSongs: 4,
    highestPosition: 12,
    songs: [],
  });

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        const responseArtist = await fetch(`${BASE_API_URL}/api/Artist/${id}`);
        const responsesongs = await fetch(`${BASE_API_URL}/api/Top2000/by-song/${id}`);
        const artistData = await responseArtist.json();
        const songsData = await responsesongs.json();

        const songsWithDetails = await Promise.all(
        (artistData.songs || []).map(async (song) => {
          const songRes = await fetch(
            `${BASE_API_URL}/api/Top2000/by-song/${song.songId}`
          );
          const songData = await songRes.json();
          return songData;
        })
      );

      function calculateAverage(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
          sum += arr[i];
        }
        return sum / arr.length;
      }
      const flatSongsWithDetails = songsWithDetails.flat();
      const positions = flatSongsWithDetails.map(song => song.position);
      const avgPosition = Math.round(calculateAverage(positions));
      const highest = Math.min(...positions);

        function calculateAverage(arr) {
          let sum = 0;
          for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
          }
          return sum / arr.length;
        }
        const flatSongsWithDetails = songsWithDetails.flat();
        const positions = flatSongsWithDetails.map(song => song.position);
        const avgPosition = Math.round(calculateAverage(positions));
        const highest = Math.min(...positions);

        const trendMap = {};
        flatSongsWithDetails.forEach(song => {
          if (song.year === 2024) {
            trendMap[song.songId] = song.trend;
          }
        });


        setAveragePosition(avgPosition);
        setHighestPosition(highest);
        setTrendMap(trendMap);
        setArtistData(prev => ({
          ...prev,
          name: artistData.name,
          biography: artistData.biography,
          photo: artistData.photo || "/example.png",
          songs: artistData.songs || [],
          trend: songsData?.trend || 0,
          amountOfSongs: artistData.songs.length || 0,
        }));
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };

    if (id) {
      fetchArtistData();
    }
  }, [id]);

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

      <main>
        <div className="row mx-0">
          <div className="container-left col-6">
            <div className="image-container">
              <img
                src={artistData.photo}
                alt={artistData.name}
                className="image-artist"
              ></img>
              <p className="artist-name">{artistData.name}</p>
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
              <p>{artistData.biography}</p>
            </div>
            <div className="artist-positions">
              <p>Aantal liedjes dit jaar: {artistData.amountOfSongs}</p>
              <p>Gemiddelde positie dit jaar: {averagePosition}</p>
              <p>Hoogste notering dit jaar: {highestPosition}</p>
            </div>
            <div className="artist-song-list">
              <h2>Top 2000 nummers</h2>
              <div className="songs-listtiles">
                {artistData.songs?.map((song, index) => (
                  <ListTile
                    key={song.songId}
                    position={index + 1}
                    imagePath={song.imgUrl || "/example.png"}
                    songName={song.titel}
                    artistName={song.artistName}
                    trend={trendMap[song.songId] || 0}
                  />
                ))}
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
