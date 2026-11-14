import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import CloverIcon from "../components/CloverIcon";

function formatDateTR(dateValue) {
  if (!dateValue) return "";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNotes() {
    try {
      const response = await axiosClient.get("/memories?type=note");
      setNotes(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) {
    return <p className="text-green-700">Notlar yükleniyor...</p>;
  }

  return (
    <section>
      <header className="mb-6 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
        <p className="text-sm font-medium text-green-700">Küçük cümleler</p>

        <h1 className="mt-2 text-4xl font-semibold text-green-950">
          Notlar
        </h1>

        <p className="mt-4 text-green-700">
          Bazen bir cümle, bir fotoğraftan daha çok şey anlatır.
        </p>
      </header>

      {notes.length === 0 ? (
        <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
          <p className="text-green-700">Henüz not eklenmedi.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <article
              key={note._id}
              className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-white/80 p-6 shadow-sm"
            >
              <CloverIcon className="absolute right-5 top-5 h-9 w-9 text-green-200" />

              <div className="relative">
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Not
                  </span>

                  {note.isFavorite && <span>❤️</span>}
                </div>

                <h2 className="text-2xl font-semibold text-green-950">
                  {note.title}
                </h2>

                <p className="mt-5 text-sm leading-7 text-green-800">
                  “{note.description}”
                </p>

                {note.date && (
                  <p className="mt-5 text-xs text-green-600">
                    {formatDateTR(note.date)}
                  </p>
                )}

                {note.tags?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
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
          ))}
        </div>
      )}
    </section>
  );
}

export default NotesPage;