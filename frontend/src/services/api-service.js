class ApiService {
    static async getTop2000() {
        try {
            const response = await fetch("https://api.example.com/top2000");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch top 2000 data:", error);
            throw error;
        }
    }
}