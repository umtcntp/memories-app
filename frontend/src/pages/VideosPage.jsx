import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { getCoverSrc, getMediaSrc } from "../utils/memoryUtils";

function VideosPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeVideoId, setActiveVideoId] = useState("");

    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [total, setTotal] = useState(0);

    async function fetchVideos(pageNumber = 1, shouldAppend = false) {
        try {
            if (shouldAppend) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const response = await axiosClient.get(
                `/memories?type=video&page=${pageNumber}&limit=12`
            );

            const newVideos = response.data.data;

            setVideos((currentVideos) =>
                shouldAppend ? [...currentVideos, ...newVideos] : newVideos
            );

            setPage(response.data.page);
            setHasNextPage(response.data.hasNextPage);
            setTotal(response.data.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        fetchVideos(1, false);
    }, []);

    async function handleLoadMore(event) {
        event.currentTarget.blur();

        const scrollYBeforeLoad = window.scrollY;

        await fetchVideos(page + 1, true);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: scrollYBeforeLoad,
                    behavior: "auto",
                });
            });
        });
    }

    if (loading) {
        return <p className="text-green-700">Videolar yükleniyor...</p>;
    }

    return (
        <section>
            <header className="mb-6 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                <p className="text-sm font-medium text-green-700">Hareketli anılar</p>

                <h1 className="mt-2 text-4xl font-semibold text-green-950">
                    Videolar
                </h1>

                <p className="mt-4 text-green-700">
                    Birlikte yaşadığımız anların hareketli, sesli ve canlı halleri.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800">
                        Toplam: {total}
                    </div>

                    <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500">
                        Yüklenen: {videos.length}
                    </div>
                </div>
            </header>

            {videos.length === 0 ? (
                <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                    <p className="text-green-700">Henüz video anısı eklenmedi.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-5 lg:grid-cols-2">
                        {videos.map((video) => {
                            const isActive = activeVideoId === video._id;
                            const coverSrc = video.coverImageUrl ? getCoverSrc(video) : "";

                            return (
                                <article
                                    key={video._id}
                                    className="overflow-hidden rounded-[2rem] border border-green-100 bg-white/80 shadow-sm"
                                >
                                    {isActive ? (
                                        <video
                                            controls
                                            autoPlay
                                            preload="metadata"
                                            src={getMediaSrc(video)}
                                            className="h-80 w-full bg-black object-cover"
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setActiveVideoId(video._id)}
                                            className="group relative h-80 w-full overflow-hidden bg-gradient-to-br from-green-100 to-rose-100 text-left"
                                        >
                                            {coverSrc && (
                                                <img
                                                    src={coverSrc}
                                                    alt={video.title || "Video kapağı"}
                                                    loading="lazy"
                                                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-green-950/45 via-green-950/10 to-white/10" />

                                            <div className="relative flex h-full w-full items-center justify-center">
                                                <div className="text-center">
                                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-3xl text-green-700 shadow-sm transition group-hover:scale-105">
                                                        ▶
                                                    </div>

                                                    <p className="mt-4 text-sm font-medium text-white drop-shadow">
                                                        {video.title || "Video"}
                                                    </p>

                                                    <p className="mt-1 text-xs text-white/90 drop-shadow">
                                                        Oynatmak için tıkla
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    )}

                                    {/* alttaki title/tags/date alanların aynı kalacak */}
                                </article>
                            );
                        })}
                    </div>

                    {hasNextPage && (
                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="rounded-2xl bg-green-700 px-6 py-3 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
                            >
                                {loadingMore ? "Yükleniyor..." : "Daha Fazla Yükle"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default VideosPage;