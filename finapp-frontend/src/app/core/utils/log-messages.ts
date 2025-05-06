export const LogMessages = {
    // Filtering
    NUMBERS_AND_LETTERS: "The search term contains letters and numbers",
    NO_NUMBERS_NOR_LETTERS: "The search term contains no letters or numbers",
    SEARCHING: (searchtype: string) => `We're searching by ${searchtype}`,
    INVALID_SEARCH: "Invalid search term.",

    // Images
    IMG_DELETED: "Image deleted",
    TMP_IMG_DELETED: "Temporary image deleted",
    NO_IMG_TO_UPLOAD: "No image to upload",

    // Google Maps
    ERR_LOADING_MAPS: (err: any) => `Error loading Google Maps: ${err}`,
}