import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import CloverIcon from "../components/CloverIcon";
import { formatDateTR } from "../utils/memoryUtils";

function SpecialDaysPage() {
    const [specialDays, setSpecialDays] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchSpecialDays() {
        try {
            const response = await axiosClient.get("/memories?type=special_day");
            setSpecialDays(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSpecialDays();
    }, []);

    if (loading) {
        return <p className="text-green-700">Özel günler yükleniyor...</p>;
    }

    return (
        <section>
            <header className="mb-6 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                <p className="text-sm font-medium text-green-700">Takvimde kalpler</p>

                <h1 className="mt-2 text-4xl font-semibold text-green-950">
                    Özel Günler
                </h1>

                <p className="mt-4 text-green-700">
                    İlkler, yıldönümleri ve unutmak istemediğimiz tarihler.
                </p>
            </header>

            {specialDays.length === 0 ? (
                <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                    <p className="text-green-700">Henüz özel gün eklenmedi.</p>
                </div>
            ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                    {specialDays.map((day) => (
                        <article
                            key={day._id}
                            className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white/80 p-6 shadow-sm"
                        >
                            <CloverIcon className="absolute -right-4 -top-4 h-24 w-24 rotate-12 text-green-100" />

                            <div className="relative">
                                <div className="mb-5 flex items-center justify-between">
                                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-500">
                                        Özel Gün
                                    </span>

                                    {day.isFavorite && <span>❤️</span>}
                                </div>

                                <p className="text-sm font-medium text-green-700">
                                    {formatDateTR(day.date)}
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold text-green-950">
                                    {day.title}
                                </h2>

                                {day.description && (
                                    <p className="mt-4 text-sm leading-7 text-green-700">
                                        {day.description}
                                    </p>
                                )}

                                {day.location && (
                                    <p className="mt-4 text-sm text-green-700">
                                        📍 {day.location}
                                    </p>
                                )}

                                {day.tags?.length > 0 && (
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {day.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default SpecialDaysPage;