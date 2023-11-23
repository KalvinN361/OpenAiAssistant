import { Routes, Route } from 'react-router';
import { Home } from './pages';

export const AIRoutes = () => {
    return (
        <div className={'h-full'}>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
};
