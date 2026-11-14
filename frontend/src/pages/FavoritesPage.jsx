import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import { getCoverSrc, getTypeIcon, getTypeLabel } from "../utils/memoryUtils";

function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    async function fetchFavorites() {
        try {
            const response = await axiosClient.get("/memories?favorite=true");
            setFavorites(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFavorites();
    }, []);


    const filteredFavorites = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) return favorites;

        return favorites.filter((memory) => {
            const searchableText = [
                memory.title,
                memory.description,
                memory.location,
                memory.artist,
                memory.type,
                ...(memory.tags || []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedSearch);
        });
    }, [favorites, searchTerm]);

    const favoriteTypeCounts = useMemo(() => {
        return favorites.reduce((counts, memory) => {
            counts[memory.type] = (counts[memory.type] || 0) + 1;
            return counts;
        }, {});
    }, [favorites]);

    if (loading) {
        return <p className="text-green-700">Favoriler yükleniyor...</p>;
    }

    return (
        <section>
            <header className="mb-6 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                <p className="text-sm font-medium text-green-700">Seçtiklerimiz</p>
                <h1 className="mt-2 text-4xl font-semibold text-green-950">
                    Favoriler
                </h1>
                <p className="mt-4 text-green-700">
                    Can ve Yonca için en özel anılar burada.
                </p>
                <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto]">
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Favorilerde ara..."
                        className="rounded-2xl border border-green-100 bg-white px-4 py-3 text-sm text-green-950 outline-none transition placeholder:text-green-300 focus:border-green-300"
                    />

                    <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500">
                        Toplam Favori: {favorites.length}
                    </div>
                </div>
                {favorites.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(favoriteTypeCounts).map(([type, count]) => (
                            <span
                                key={type}
                                className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700"
                            >
                                {getTypeLabel(type)}: {count}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            {favorites.length === 0 ? (
                <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                    <p className="text-green-700">Henüz favori anı eklenmedi.</p>
                </div>
            ) : filteredFavorites.length === 0 ? (
                <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                    <p className="text-green-700">
                        Aramana uygun favori anı bulunamadı.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredFavorites.map((memory) => {
                        const mediaSrc = getCoverSrc(memory);

                        return (
                            <article
                                key={memory._id}
                                className="overflow-hidden rounded-[2rem] border border-green-100 bg-white/80 shadow-sm"
                            >
                                {mediaSrc ? (
                                    <img
                                        src={mediaSrc}
                                        alt={memory.title}
                                        className="h-64 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-64 items-center justify-center bg-gradient-to-br from-green-100 to-rose-100 text-5xl text-green-700">
                                        {getTypeIcon(memory.type)}
                                    </div>
                                )}

                                <div className="p-5">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                            {getTypeLabel(memory.type)}
                                        </span>

                                        <span>❤️</span>
                                    </div>

                                    <h2 className="text-xl font-semibold text-green-950">
                                        {memory.title}
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-green-700">
                                        {memory.description}
                                    </p>

                                    {memory.artist && (
                                        <p className="mt-3 text-sm text-green-700">
                                            Sanatçı: {memory.artist}
                                        </p>
                                    )}

                                    {memory.duration && (
                                        <p className="mt-2 text-sm text-green-700">
                                            Süre: {memory.duration}
                                        </p>
                                    )}

                                    {memory.location && (
                                        <p className="mt-2 text-sm text-green-700">
                                            📍 {memory.location}
                                        </p>
                                    )}

                                    {memory.tags?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {memory.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-500"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default FavoritesPage;