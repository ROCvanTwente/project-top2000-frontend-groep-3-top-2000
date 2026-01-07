import React from 'react'
import NavBar from '../components/navBar'
import { ListTile } from '../components/listTile'
import { Footer } from '../components/footer'
import { Carousel } from '../components/carousel'

const carouselItems = [
    {
        image: '/example.png',
        href: '/',
        alt: 'Description',
        caption: 'Title',
        description: 'Optional description'
    },
    {
        image: 'example.png',
        href: '/',
        alt: 'Description 2'
    }
];

const Homepage = () => {
    return (
        <div className="w-full min-h-screen flex flex-col bg-gray-100">
            <NavBar />
            <main className="flex flex-1 flex-col items-center justify-center text-center p-4">
                <Carousel items={carouselItems} carouselId="myCarousel" />
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