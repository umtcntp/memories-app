import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import { getMediaSrc } from "../utils/memoryUtils";

function PhotosPage() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [total, setTotal] = useState(0);

    async function fetchPhotos(pageNumber = 1, shouldAppend = false) {
        try {
            if (shouldAppend) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const response = await axiosClient.get(
                `/memories?type=photo&page=${pageNumber}&limit=30`
            );

            const newPhotos = response.data.data;

            setPhotos((currentPhotos) =>
                shouldAppend ? [...currentPhotos, ...newPhotos] : newPhotos
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
        fetchPhotos(1, false);
    }, []);

    async function handleLoadMore(event) {
        event.currentTarget.blur();

        const scrollYBeforeLoad = window.scrollY;

        await fetchPhotos(page + 1, true);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: scrollYBeforeLoad,
                    behavior: "auto",
                });
            });
        });
    }

    const filteredPhotos = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) return photos;

        return photos.filter((photo) => {
            const searchableText = [
                photo.title,
                photo.description,
                photo.location,
                ...(photo.tags || []),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedSearch);
        });
    }, [photos, searchTerm]);

    const favoritePhotoCount = useMemo(() => {
        return photos.filter((photo) => photo.isFavorite).length;
    }, [photos]);

    if (loading) {
        return <p className="text-green-700">Fotoğraflar yükleniyor...</p>;
    }

    return (
        <section>
            <header className="mb-6 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                <p className="text-sm font-medium text-green-700">Galeri</p>
                <h1 className="mt-2 text-4xl font-semibold text-green-950">
                    Fotoğraflar
                </h1>
                <p className="mt-4 text-green-700">
                    Google Drive’dan gelen fotoğraf anılarımız.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                    <input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Fotoğraflarda ara..."
                        className="rounded-2xl border border-green-100 bg-white px-4 py-3 text-sm text-green-950 outline-none transition placeholder:text-green-300 focus:border-green-300"
                    />

                    <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800">
                        Toplam: {total}
                    </div>

                    <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500">
                        Yüklenen: {photos.length}
                    </div>

                    <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500">
                        Favori: {favoritePhotoCount}
                    </div>
                </div>
            </header>

            {photos.length === 0 ? (
                <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                    <p className="text-green-700">Henüz fotoğraf eklenmedi.</p>
                </div>
            ) : filteredPhotos.length === 0 ? (
                <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                    <p className="text-green-700">Aramana uygun fotoğraf bulunamadı.</p>
                </div>
            ) : (
                <>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredPhotos.map((photo) => (
                            <article
                                key={photo._id}
                                className="overflow-hidden rounded-[2rem] border border-green-100 bg-white/80 shadow-sm"
                            >
                                {photo.mediaUrl && (
                                    <img
                                        src={getMediaSrc(photo)}
                                        alt={photo.title}
                                        loading="lazy"
                                        className="h-72 w-full object-cover"
                                    />
                                )}

                                {/* kart içeriği aynı kalacak */}
                            </article>
                        ))}
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

export default PhotosPage;