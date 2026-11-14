import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { getCoverSrc } from "../utils/memoryUtils";

function MusicPage() {
    const [musicList, setMusicList] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchMusic() {
        try {
            const response = await axiosClient.get("/memories?type=music");
            setMusicList(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMusic();
    }, []);

    if (loading) {
        return <p className="text-green-700">Müzikler yükleniyor...</p>;
    }

    return (
        <section>
            <header className="mb-6 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                <p className="text-sm font-medium text-green-700">Bizim şarkılarımız</p>

                <h1 className="mt-2 text-4xl font-semibold text-green-950">
                    Müzikler
                </h1>

                <p className="mt-4 text-green-700">
                    Can ve Yonca’ya özel şarkılar, playlistler ve küçük müzik anıları.
                </p>
            </header>

            {musicList.length === 0 ? (
                <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                    <p className="text-green-700">Henüz müzik eklenmedi.</p>
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                    {musicList.map((music) => {
                        const coverSrc = getCoverSrc(music);

                        return (
                            <article
                                key={music._id}
                                className="rounded-[2rem] border border-green-100 bg-white/80 p-5 shadow-sm"
                            >
                                <div className="flex gap-5">
                                    {coverSrc ? (
                                        <img
                                            src={coverSrc}
                                            alt={music.title}
                                            className="h-28 w-28 shrink-0 rounded-3xl object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-green-100 to-rose-100 text-4xl text-green-700">
                                            ♪
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="mb-3 flex items-center justify-between gap-3">
                                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                                                Müzik
                                            </span>

                                            {music.isFavorite && <span>❤️</span>}
                                        </div>

                                        <h2 className="text-2xl font-semibold text-green-950">
                                            {music.title}
                                        </h2>

                                        <p className="mt-1 text-sm text-green-700">
                                            {music.artist || "Can & Yonca"}
                                        </p>

                                        {music.description && (
                                            <p className="mt-3 text-sm leading-6 text-green-700">
                                                {music.description}
                                            </p>
                                        )}

                                        <div className="mt-4 h-1.5 rounded-full bg-green-100">
                                            <div className="h-1.5 w-1/3 rounded-full bg-rose-400" />
                                        </div>

                                        <div className="mt-3 flex items-center justify-between text-xs text-green-600">
                                            <span>Süre: {music.duration || "00:00"}</span>
                                            {music.externalUrl ? (
                                                <a
                                                    href={music.externalUrl}
                                                    target="_blank"
                                                    rel="noopener"
                                                    className="rounded-full bg-rose-400 px-4 py-2 text-sm text-white"
                                                >
                                                    ▶ Dinle
                                                </a>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="rounded-full bg-rose-200 px-4 py-2 text-sm text-white"
                                                >
                                                    Link yok
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default MusicPage;