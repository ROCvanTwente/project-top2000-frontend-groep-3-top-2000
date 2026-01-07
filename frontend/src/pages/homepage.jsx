import React from 'react'
import NavBar from '../components/navBar'
import { ListTile } from '../components/listTile'
import { Footer } from '../components/footer'



const Homepage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-100">
            <NavBar />
            <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
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
                <ListTile
                    position={1}
                    imagePath="/some/cover.jpg"
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
            </main>
            <Footer />
        </div>
    )
}

export default Homepage