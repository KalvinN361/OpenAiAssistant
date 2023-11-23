import axios from 'axios';

// export const base = 'http://localhost:3001';

export const base = 'https://openvenkmanbackend-snzjakgcva-vp.a.run.app';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE
        ? process.env.NEXT_PUBLIC_API_BASE
        : base,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

export type ApiError = {
    message: String;
};
