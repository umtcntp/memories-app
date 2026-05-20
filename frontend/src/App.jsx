import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PhotosPage from "./pages/PhotosPage";
import AppLayout from "./layouts/AppLayout";
import FavoritesPage from "./pages/FavoritesPage";
import NotesPage from "./pages/NotesPage";
import MusicPage from "./pages/MusicPage";
import AudioPage from "./pages/AudioPage";
import SpecialDaysPage from "./pages/SpecialDaysPage";
import VideosPage from "./pages/VideosPage";
import NewMemoryPage from "./pages/NewMemoryPage";
import AdminMemoriesPage from "./pages/AdminMemoriesPage";
import EditMemoryPage from "./pages/EditMemoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/audio" element={<AudioPage />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/special-days" element={<SpecialDaysPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/admin/memories/new" element={<NewMemoryPage />} />
        <Route path="/admin/memories" element={<AdminMemoriesPage />} />
        <Route path="/admin/memories/:id/edit" element={<EditMemoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;