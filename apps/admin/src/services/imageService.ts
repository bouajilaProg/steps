export default class ImageService {
  private apiUrl: string

  constructor(baseUrl: string) {
    this.apiUrl = baseUrl
  }

  /**
   * Uploads an image file to the server.
   * Uses a mock implementation that resolves with a fake URL after a delay.
   */
  uploadImage(file: File): Promise<{ url: string }> {
    if (!this.apiUrl) {
       console.warn("API URL is missing")
    }

    return new Promise((resolve) => {
      // Create a local object URL to display the image immediately in the UI
      const mockUrl = URL.createObjectURL(file)

      setTimeout(() => {
        resolve({ url: mockUrl })
      }, 1000) // Simulate network delay
    })

    /* 
    // Real implementation
    const formData = new FormData()
    formData.append('image', file)

    return fetch(`${this.apiUrl}/upload`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json())
    */
  }
}

// read from .env 
const apiUrl = import.meta.env.VITE_API_URL || ''

export const imageService = new ImageService(apiUrl)
