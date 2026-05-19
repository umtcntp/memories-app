import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import CloverIcon from "../components/CloverIcon";
import { useNavigate, useOutletContext } from "react-router-dom";
import { formatDateTR, getCoverSrc, getMediaSrc } from "../utils/memoryUtils";

function DashboardPage() {
    const { user } = useOutletContext();
    const navigate = useNavigate();

    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [photoTotal, setPhotoTotal] = useState(0);
    const [videoTotal, setVideoTotal] = useState(0);
    const [specialDayTotal, setSpecialDayTotal] = useState(0);
    const [musicTotal, setMusicTotal] = useState(0);
    const [audioTotal, setAudioTotal] = useState(0);

    const [featuredAudios, setFeaturedAudios] = useState([]);
    const [featuredSpecialDays, setFeaturedSpecialDays] = useState([]);

    const photoMemories = useMemo(
        () => memories.filter((memory) => memory.type === "photo"),
        [memories]
    );

    const favoriteMemories = useMemo(
        () => memories.filter((memory) => memory.isFavorite),
        [memories]
    );

    const videoMemories = useMemo(
        () => memories.filter((memory) => memory.type === "video"),
        [memories]
    );

    const noteMemories = useMemo(
        () => memories.filter((memory) => memory.type === "note"),
        [memories]
    );

    const musicMemories = useMemo(
        () => memories.filter((memory) => memory.type === "music"),
        [memories]
    );

    async function fetchData() {
        try {
            const [
                memoriesResponse,
                photoCountResponse,
                videoCountResponse,
                specialDaysResponse,
                musicCountResponse,
                audioResponse,
            ] = await Promise.all([
                axiosClient.get("/memories?limit=60"),
                axiosClient.get("/memories?type=photo&page=1&limit=1"),
                axiosClient.get("/memories?type=video&page=1&limit=1"),
                axiosClient.get("/memories?type=special_day&page=1&limit=4"),
                axiosClient.get("/memories?type=music&page=1&limit=1"),
                axiosClient.get("/memories?type=audio&page=1&limit=3"),
            ]);

            setMemories(memoriesResponse.data.data);

            setPhotoTotal(photoCountResponse.data.total);
            setVideoTotal(videoCountResponse.data.total);

            setSpecialDayTotal(specialDaysResponse.data.total);
            setFeaturedSpecialDays(specialDaysResponse.data.data);

            setMusicTotal(musicCountResponse.data.total);

            setAudioTotal(audioResponse.data.total);
            setFeaturedAudios(audioResponse.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f7f4ec]">
                <div className="flex items-center gap-3 text-green-800">
                    <CloverIcon className="h-6 w-6 animate-pulse" />
                    <span>Anılar yükleniyor...</span>
                </div>
            </main>
        );
    }

    return (
        <>
            <HeroSection user={user} />

            <section className="mt-6 grid gap-5 xl:grid-cols-12">
                <PhotosCard
                    memories={photoMemories}
                    total={photoTotal}
                    onOpen={() => navigate("/photos")}
                />

                <VideosCard
                    memories={videoMemories}
                    total={videoTotal}
                    onOpen={() => navigate("/videos")}
                />

                <SpecialDaysCard
                    memories={featuredSpecialDays}
                    total={specialDayTotal}
                    onOpen={() => navigate("/special-days")}
                />

                <NotesCard
                    memories={noteMemories}
                    onOpen={() => navigate("/notes")}
                />

                <FavoritesCard
                    memories={favoriteMemories}
                    onOpen={() => navigate("/favorites")}
                />

                <CalendarCard />

                <AudioCard
                    memories={featuredAudios}
                    total={audioTotal}
                    onOpen={() => navigate("/audio")}
                />

                <MusicCard
                    memories={musicMemories}
                    total={musicTotal}
                    onOpen={() => navigate("/music")}
                />
            </section>
        </>
    );
}

function HeroSection({ user }) {
    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-white/80 p-6 shadow-sm sm:p-8 lg:p-10">
            <CloverIcon className="absolute right-20 top-16 h-6 w-6 -rotate-12 text-green-300" />
            <CloverIcon className="absolute bottom-8 right-8 h-10 w-10 text-green-200" />

            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
                <div>
                    <p className="text-sm font-medium text-green-700">
                        Hoş geldin, {user?.name}
                    </p>

                    <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-green-950 sm:text-5xl">
                        Birlikte biriktirdiğimiz en güzel anılar
                        <span className="text-rose-500"> ♥</span>
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-7 text-green-700">
                        Küçük anlar, büyük hatıralar. Can ve Yonca’nın fotoğrafları,
                        videoları, sesleri ve notları burada saklanıyor.
                    </p>
                </div>

                <div className="hidden justify-center lg:flex">
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-green-50">
                        <div className="text-center">
                            <CloverIcon className="mx-auto h-16 w-16 text-green-500" />
                            <p className="mt-3 text-sm text-green-700">İyi ki biz</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-rose-100 bg-rose-50/50 p-6">
                    <p className="text-4xl text-rose-400">“</p>
                    <p className="mt-2 text-2xl font-medium leading-snug text-green-950">
                        Beraberken zaman duruyor, anılar büyüyor.
                    </p>
                    <p className="mt-4 text-rose-500">♥</p>
                </div>
            </div>
        </section>
    );
}

function PhotosCard({ memories, total, onOpen }) {
    const firstPhoto =
        memories.find((memory) => memory.tags?.includes("dashboard-cover")) ||
        memories.find((memory) => memory.isFavorite) ||
        memories[0];

    const otherPhotos = memories
        .filter((memory) => memory._id !== firstPhoto?._id)
        .slice(0, 3);

    return (
        <article className="rounded-[2rem] border border-green-100 bg-white/80 p-5 shadow-sm xl:col-span-4">
            <CardHeader
                icon="▧"
                title="Fotoğraflar"
                subtitle={`${total} fotoğraf`}
                onOpen={onOpen}
            />

            {firstPhoto ? (
                <>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <img
                            src={getMediaSrc(firstPhoto)}
                            alt={firstPhoto.title}
                            loading="lazy"
                            className="col-span-2 h-60 rounded-3xl object-cover"
                        />

                        <div className="grid gap-3">
                            {otherPhotos.length > 0 ? (
                                otherPhotos.map((memory) => (
                                    <img
                                        key={memory._id}
                                        src={getMediaSrc(memory)}
                                        alt={memory.title}
                                        loading="lazy"
                                        className="h-[72px] rounded-2xl object-cover"
                                    />
                                ))
                            ) : (
                                <>
                                    <PlaceholderTile />
                                    <PlaceholderTile />
                                    <div className="flex h-[72px] items-center justify-center rounded-2xl bg-green-900/80 text-sm font-medium text-white">
                                        +{Math.max(total - 1, 0)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {firstPhoto.location && (
                        <p className="mt-4 text-sm text-green-700">
                            📍 {firstPhoto.location}
                        </p>
                    )}
                </>
            ) : (
                <EmptyCardText text="Henüz fotoğraf anısı eklenmedi." />
            )}
        </article>
    );
}

function VideosCard({ memories, total, onOpen }) {
    const firstVideo = memories[0];

    return (
        <article className="rounded-[2rem] border border-green-100 bg-white/80 p-5 shadow-sm xl:col-span-4">
            <CardHeader
                icon="▶"
                title="Videolar"
                subtitle={`${total} video`}
                onOpen={onOpen}
            />

            {firstVideo ? (
                <button
                    type="button"
                    onClick={onOpen}
                    className="group relative mt-5 h-60 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-green-100 via-stone-100 to-rose-100 text-left transition hover:scale-[1.01]"
                >
                    <div className="absolute inset-0 bg-white/20" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-3xl text-green-700 shadow-sm transition group-hover:scale-105">
                            ▶
                        </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="line-clamp-1 text-sm font-semibold text-green-950">
                            {firstVideo.title}
                        </p>

                        <p className="mt-1 text-xs text-green-700">
                            İzlemek için tıkla
                        </p>
                    </div>
                </button>
            ) : (
                <div className="mt-5 flex h-60 items-center justify-center rounded-3xl bg-gradient-to-br from-green-100 to-rose-50">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-2xl text-green-700">
                            ▶
                        </div>

                        <p className="mt-4 text-sm text-green-700">
                            Video anıları yakında burada.
                        </p>
                    </div>
                </div>
            )}
        </article>
    );
}

function SpecialDaysCard({ memories, total, onOpen }) {
    return (
        <article className="rounded-[2rem] border border-rose-100 bg-white/80 p-5 shadow-sm xl:col-span-4">
            <CardHeader
                icon="□"
                title="Özel Günler"
                subtitle={`${total} anı`}
                onOpen={onOpen}
            />

            {memories.length > 0 ? (
                <div className="mt-5 divide-y divide-green-50 rounded-3xl bg-white">
                    {memories.slice(0, 4).map((memory) => (
                        <div
                            key={memory._id}
                            className="flex items-center justify-between gap-3 px-4 py-3"
                        >
                            <span className="text-sm text-green-700">
                                {formatDateTR(memory.date)}
                            </span>

                            <span className="text-sm font-medium text-green-950">
                                {memory.title}
                            </span>

                            <span className="text-rose-400">♡</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-5 rounded-3xl bg-rose-50/60 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-rose-400">
                            ♡
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-green-950">
                                İlk özel günü ekleyelim mi?
                            </p>
                            <p className="mt-1 text-xs leading-5 text-green-700">
                                Yıldönümleri, ilk buluşmalar ve unutulmaması gereken küçük tarihler burada saklanır.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onOpen}
                        className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-rose-500 transition hover:bg-rose-100"
                    >
                        Özel günlere git
                    </button>
                </div>
            )}
        </article>
    );
}

function NotesCard({ memories, onOpen }) {
    const firstNote = memories[0];

    return (
        <article className="rounded-[2rem] border border-green-100 bg-white/80 p-5 shadow-sm xl:col-span-4">
            <CardHeader
                icon="✎"
                title="Notlar"
                subtitle={`${memories.length} not`}
                onOpen={onOpen}
            />

            {firstNote ? (
                <div className="relative mt-5 rounded-3xl bg-green-50 p-5">
                    <CloverIcon className="absolute bottom-3 right-4 h-8 w-8 text-green-300" />
                    <p className="relative text-sm leading-6 text-green-950">
                        “{firstNote.description}”
                    </p>
                    <p className="relative mt-4 text-xs text-green-600">
                        {firstNote.title}
                    </p>
                </div>
            ) : (
                <EmptyCardText text="Henüz not eklenmedi." />
            )}
        </article>
    );
}

function FavoritesCard({ memories, onOpen }) {
    return (
        <article className="rounded-[2rem] border border-rose-100 bg-white/80 p-5 shadow-sm xl:col-span-4">
            <CardHeader
                icon="♥"
                title="Favoriler"
                subtitle={`${memories.length} öğe`}
                onOpen={onOpen}
            />

            {memories.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                    {memories.slice(0, 4).map((memory) => (
                        <FavoriteMiniCard key={memory._id} memory={memory} />
                    ))}
                </div>
            ) : (
                <EmptyCardText text="Favori anı yok." />
            )}
        </article>
    );
}

function FavoriteMiniCard({ memory }) {
    const coverSrc = getCoverSrc(memory);

    return (
        <div className="overflow-hidden rounded-2xl bg-green-50">
            {coverSrc ? (
                <img
                    src={coverSrc}
                    alt={memory.title}
                    className="h-20 w-full object-cover"
                />
            ) : (
                <div className="flex h-20 w-full items-center justify-center bg-gradient-to-br from-green-100 to-rose-100 text-2xl">
                    {memory.type === "note" && "✎"}
                    {memory.type === "music" && "♪"}
                    {memory.type === "audio" && "🎙"}
                    {memory.type === "special_day" && "♡"}
                    {memory.type === "video" && "▶"}
                </div>
            )}

            <div className="p-3">
                <p className="line-clamp-1 text-sm font-medium text-green-950">
                    {memory.title}
                </p>
                <p className="mt-1 text-xs text-green-600">
                    {memory.type}
                </p>
            </div>
        </div>
    );
}

function CalendarCard() {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    const monthName = new Intl.DateTimeFormat("tr-TR", {
        month: "long",
    }).format(today);

    const weekdayName = new Intl.DateTimeFormat("tr-TR", {
        weekday: "long",
    }).format(today);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

    const firstWeekday = firstDayOfMonth.getDay();
    const emptyDaysBeforeMonth = firstWeekday === 0 ? 6 : firstWeekday - 1;

    const calendarDays = [
        ...Array.from({ length: emptyDaysBeforeMonth }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    return (
        <article className="relative overflow-hidden rounded-[2rem] bg-green-800 p-6 text-white shadow-sm xl:col-span-4">
            <CloverIcon className="absolute bottom-5 left-5 h-12 w-12 text-green-300/50" />

            <div className="relative">
                <p className="text-sm text-green-100">Bugün</p>

                <h2 className="mt-4 text-3xl font-semibold">
                    {currentDay} {capitalizeTR(monthName)} {currentYear}
                </h2>

                <p className="mt-2 text-green-100">
                    {capitalizeTR(weekdayName)} ☼
                </p>

                <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs text-green-100">
                    {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
                        <span key={day} className="font-medium">
                            {day}
                        </span>
                    ))}

                    {calendarDays.map((day, index) =>
                        day ? (
                            <span
                                key={`${day}-${index}`}
                                className={`rounded-full py-1 ${
                                    day === currentDay
                                        ? "bg-rose-400 text-white"
                                        : "text-green-50"
                                }`}
                            >
                                {day}
                            </span>
                        ) : (
                            <span key={`empty-${index}`} />
                        )
                    )}
                </div>
            </div>
        </article>
    );
}

function capitalizeTR(text) {
    if (!text) return "";

    return text.charAt(0).toLocaleUpperCase("tr-TR") + text.slice(1);
}

function AudioCard({ memories, total, onOpen }) {
    return (
        <article className="rounded-[2rem] border border-green-100 bg-white/80 p-5 shadow-sm xl:col-span-4">
            <CardHeader
                icon="🎙"
                title="Ses Kayıtları"
                subtitle={`${total} kayıt`}
                onOpen={onOpen}
            />

            {memories.length > 0 ? (
                <div className="mt-5 space-y-3">
                    {memories.slice(0, 3).map((memory) => (
                        <AudioRow
                            key={memory._id}
                            title={memory.title}
                            duration={memory.duration || "00:00"}
                            onOpen={onOpen}
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-5 rounded-3xl bg-green-50 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-green-700">
                            🎙
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-green-950">
                                Henüz ses kaydı görünmüyor
                            </p>
                            <p className="mt-1 text-xs leading-5 text-green-700">
                                Drive’a yüklediğin ses kayıtlarını admin panelden ekleyebilirsin.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onOpen}
                        className="mt-4 rounded-2xl bg-white px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                    >
                        Ses kayıtlarına git
                    </button>
                </div>
            )}
        </article>
    );
}

function MusicCard({ memories, total, onOpen }) {
    const firstMusic = memories[0];

    return (
        <article className="rounded-[2rem] border border-green-100 bg-white/80 p-5 shadow-sm xl:col-span-8">
            <CardHeader
                icon="♪"
                title="Müzikler"
                subtitle={`${total} şarkı`}
                onOpen={onOpen}
            />

            {firstMusic ? (
                <div className="mt-5 flex items-center gap-4 rounded-3xl bg-white p-4">
                    {firstMusic.coverImageUrl ? (
                        <img
                            src={getCoverSrc(firstMusic)}
                            alt={firstMusic.title}
                            className="h-16 w-16 rounded-2xl object-cover"
                        />
                    ) : (
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-200 to-rose-200" />
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-green-950">
                            {firstMusic.title}
                        </p>

                        <p className="text-sm text-green-700">
                            {firstMusic.artist ||
                                firstMusic.description ||
                                "Can & Yonca playlist"}
                        </p>

                        <div className="mt-3 h-1.5 rounded-full bg-green-100">
                            <div className="h-1.5 w-1/3 rounded-full bg-rose-400" />
                        </div>

                        <p className="mt-2 text-xs text-green-600">
                            Süre: {firstMusic.duration || "03:45"}
                        </p>
                    </div>

                    {firstMusic.externalUrl ? (
                        <a
                            href={firstMusic.externalUrl}
                            target="_blank"
                            rel="noopener"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-400 text-white"
                        >
                            ▶
                        </a>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-200 text-white"
                        >
                            ▶
                        </button>
                    )}
                </div>
            ) : (
                <EmptyCardText text="Henüz müzik eklenmedi." />
            )}
        </article>
    );
}

function CardHeader({ icon, title, subtitle, onOpen }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-lg text-green-700">
                    {icon}
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-green-950">
                        {title}
                    </h2>
                    <p className="text-sm text-rose-500">{subtitle}</p>
                </div>
            </div>

            {onOpen && (
                <button
                    type="button"
                    onClick={onOpen}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-green-900 transition hover:bg-green-50"
                >
                    ›
                </button>
            )}
        </div>
    );
}

function AudioRow({ title, duration, onOpen }) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className="flex w-full items-center gap-3 rounded-2xl bg-green-50 px-3 py-2 text-left transition hover:bg-green-100"
        >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-green-700">
                ▶
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-green-950">
                    {title}
                </p>

                <div className="mt-2 flex items-end gap-1">
                    {Array.from({ length: 22 }, (_, index) => (
                        <span
                            key={index}
                            className="w-1 rounded-full bg-green-300"
                            style={{ height: `${8 + (index % 5) * 3}px` }}
                        />
                    ))}
                </div>
            </div>

            <span className="text-xs text-green-700">{duration}</span>
        </button>
    );
}

function PlaceholderTile() {
    return (
        <div className="h-[72px] rounded-2xl bg-gradient-to-br from-green-100 to-rose-50" />
    );
}

function EmptyCardText({ text }) {
    return <p className="mt-5 text-sm text-green-700">{text}</p>;
}

export default DashboardPage;