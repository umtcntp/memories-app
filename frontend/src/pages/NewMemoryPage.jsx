import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const memoryTypes = [
    { value: "photo", label: "Fotoğraf" },
    { value: "video", label: "Video" },
    { value: "note", label: "Not" },
    { value: "audio", label: "Ses Kaydı" },
    { value: "music", label: "Müzik" },
    { value: "special_day", label: "Özel Gün" },
];

function NewMemoryPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "photo",
        driveFileId: "",
        coverImageFileId: "",
        externalUrl: "",
        date: "",
        location: "",
        duration: "",
        artist: "",
        tags: "",
        isFavorite: false,
    });

    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSubmitting(true);
        setErrorMessage("");

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                driveFileId: formData.driveFileId,
                coverImageFileId: formData.coverImageFileId,
                externalUrl: formData.externalUrl,
                date: formData.date || undefined,
                location: formData.location,
                duration: formData.duration,
                artist: formData.artist,
                tags: formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                isFavorite: formData.isFavorite,
            };

            await axiosClient.post("/memories", payload);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error.response?.data?.message || "Anı eklenirken bir hata oluştu."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section>
            <header className="mb-6 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
                <p className="text-sm font-medium text-green-700">Admin</p>

                <h1 className="mt-2 text-4xl font-semibold text-green-950">
                    Yeni Anı Ekle
                </h1>

                <p className="mt-4 text-green-700">
                    Google Drive dosya ID’si ile yeni fotoğraf, video, not veya özel anı
                    ekleyebilirsin.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="rounded-[2rem] border border-green-100 bg-white/80 p-6 shadow-sm"
            >
                {errorMessage && (
                    <div className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-500">
                        {errorMessage}
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-2">
                    <FormField label="Başlık">
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="input"
                            placeholder="İlk Drive Fotoğrafı"
                        />
                    </FormField>

                    <FormField label="Tip">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="input"
                        >
                            {memoryTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Google Drive File ID">
                        <input
                            name="driveFileId"
                            value={formData.driveFileId}
                            onChange={handleChange}
                            className="input"
                            placeholder="1ZoDJhB3HhBEw7WrJd..."
                        />
                    </FormField>

                    <FormField label="Cover Image File ID">
                        <input
                            name="coverImageFileId"
                            value={formData.coverImageFileId}
                            onChange={handleChange}
                            className="input"
                            placeholder="Müzik veya ses kaydı kapağı için"
                        />
                    </FormField>

                    <FormField label="External URL">
                        <input
                            name="externalUrl"
                            value={formData.externalUrl}
                            onChange={handleChange}
                            className="input"
                            placeholder="YouTube veya Spotify linki"
                        />
                    </FormField>

                    <FormField label="Tarih">
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="input"
                        />
                    </FormField>

                    <FormField label="Konum">
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="input"
                            placeholder="İstanbul"
                        />
                    </FormField>

                    <FormField label="Süre">
                        <input
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            className="input"
                            placeholder="03:45"
                        />
                    </FormField>

                    <FormField label="Artist">
                        <input
                            name="artist"
                            value={formData.artist}
                            onChange={handleChange}
                            className="input"
                            placeholder="Can & Yonca"
                        />
                    </FormField>

                    <div className="md:col-span-2">
                        <FormField label="Açıklama">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                className="input resize-none"
                                placeholder="Bu anı hakkında küçük bir not..."
                            />
                        </FormField>
                    </div>

                    <div className="md:col-span-2">
                        <FormField label="Etiketler">
                            <input
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="input"
                                placeholder="aşk, gezi, ilkler"
                            />
                            <p className="mt-2 text-xs text-green-600">
                                Etiketleri virgülle ayır: aşk, gezi, ilkler
                            </p>
                        </FormField>
                    </div>

                    <label className="flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-800 md:col-span-2">
                        <input
                            type="checkbox"
                            name="isFavorite"
                            checked={formData.isFavorite}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        Favorilere ekle
                    </label>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="rounded-2xl border border-green-100 bg-white px-5 py-3 text-sm font-medium text-green-800 hover:bg-green-50"
                    >
                        Vazgeç
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
                    >
                        {submitting ? "Ekleniyor..." : "Anı Ekle"}
                    </button>
                </div>
            </form>
        </section>
    );
}

function FormField({ label, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-green-900">
                {label}
            </span>
            {children}
        </label>
    );
}

export default NewMemoryPage;