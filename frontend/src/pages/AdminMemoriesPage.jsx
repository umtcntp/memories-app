import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { formatDateTR, getTypeLabel } from "../utils/memoryUtils";

function AdminMemoriesPage() {
    const navigate = useNavigate();

    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState("");

    async function fetchMemories() {
        try {
            const response = await axiosClient.get("/memories?page=1&limit=200");
            setMemories(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(memory) {
        const confirmed = window.confirm(
            `"${memory.title}" anısını silmek istediğine emin misin?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(memory._id);
            await axiosClient.delete(`/memories/${memory._id}`);
            setMemories((current) =>
                current.filter((item) => item._id !== memory._id)
            );
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Anı silinirken hata oluştu.");
        } finally {
            setDeletingId("");
        }
    }

    useEffect(() => {
        fetchMemories();
    }, []);

    if (loading) {
        return <p className="text-green-700">Anılar yükleniyor...</p>;
    }

    return (
        <section>
            <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-sm font-medium text-green-700">Admin</p>

                    <h1 className="mt-2 text-4xl font-semibold text-green-950">
                        Anıları Yönet
                    </h1>

                    <p className="mt-4 text-green-700">
                        Eklenen tüm anıları buradan düzenleyebilir veya silebilirsin.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/admin/memories/new")}
                    className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800"
                >
                    + Yeni Anı
                </button>
            </header>

            <div className="overflow-hidden rounded-[2rem] border border-green-100 bg-white/80 shadow-sm">
                {memories.length === 0 ? (
                    <div className="p-8">
                        <p className="text-green-700">Henüz anı eklenmedi.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-green-50 text-sm text-green-800">
                                <tr>
                                    <th className="px-5 py-4 font-medium">Başlık</th>
                                    <th className="px-5 py-4 font-medium">Tip</th>
                                    <th className="px-5 py-4 font-medium">Tarih</th>
                                    <th className="px-5 py-4 font-medium">Favori</th>
                                    <th className="px-5 py-4 font-medium">İşlemler</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-green-50">
                                {memories.map((memory) => (
                                    <tr key={memory._id} className="text-sm">
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-medium text-green-950">
                                                    {memory.title}
                                                </p>
                                                <p className="mt-1 line-clamp-1 text-xs text-green-600">
                                                    {memory.description}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-green-700">
                                            {getTypeLabel(memory.type)}
                                        </td>

                                        <td className="px-5 py-4 text-green-700">
                                            {formatDateTR(memory.date) || "-"}
                                        </td>

                                        <td className="px-5 py-4">
                                            {memory.isFavorite ? "❤️" : "-"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/admin/memories/${memory._id}/edit`)
                                                    }
                                                    className="rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-800 hover:bg-green-100"
                                                >
                                                    Düzenle
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(memory)}
                                                    disabled={deletingId === memory._id}
                                                    className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-100 disabled:opacity-60"
                                                >
                                                    {deletingId === memory._id ? "Siliniyor..." : "Sil"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminMemoriesPage;