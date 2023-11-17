import axios from 'axios';


export class PhotoAPI {
    static BASE_URL = 'https://pixabay.com';
    static API = '40670268-b3ad9432c00754cff3407f78c';
    static END_POINT = '/api/';
    static PER_PAGE = 40;

    constructor() {
        this.q = '';
        this.page = 1;
        this.totalPage = 1;
    }

    async fetchPhoto() {
        const PARAMS = new URLSearchParams({
            key: PhotoAPI.API,
            q: this.q,
            page: this.page,
            per_page: PhotoAPI.PER_PAGE,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        });

        const url = `${PhotoAPI.BASE_URL}${PhotoAPI.END_POINT}?${PARAMS}`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

