class ApiService {
    static async getTop2000() {
        // Mock data since the API is placeholder
        return [
            {
                position: 1,
                imagePath: "/some/cover.jpg",
                songName: "Bohemian Rhapsody",
                artistName: "Queen",
                trend: 12
            },
            {
                position: 2,
                imagePath: "/some/cover.jpg",
                songName: "Stairway to Heaven",
                artistName: "Led Zeppelin",
                trend: -5
            },
            {
                position: 3,
                imagePath: "/some/cover.jpg",
                songName: "Hotel California",
                artistName: "Eagles",
                trend: 0
            }
        ];
    }
}

export default ApiService;
