import axios from "axios";
import { Notify } from "notiflix";

export async function fetchPhotos(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        Notify.failure('Sorry, some server error. Please try again.')
    };
};