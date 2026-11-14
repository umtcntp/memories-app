import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import CloverIcon from "../components/CloverIcon";
import { getMediaSrc } from "../utils/memoryUtils";

function AudioPage() {
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAudio() {
    try {
      const response = await axiosClient.get("/memories?type=audio&page=1&limit=30");
      setAudioList(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAudio();
  }, []);

  if (loading) {
    return <p className="text-green-700">Ses kayıtları yükleniyor...</p>;
  }

  return (
    <section>
      <header className="mb-6 rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
        <p className="text-sm font-medium text-green-700">Küçük sesler</p>

        <h1 className="mt-2 text-4xl font-semibold text-green-950">
          Ses Kayıtları
        </h1>

        <p className="mt-4 text-green-700">
          Bazen bir ses, bir anıyı olduğu gibi geri getirir.
        </p>
      </header>

      {audioList.length === 0 ? (
        <div className="rounded-[2rem] border border-green-100 bg-white/80 p-8 shadow-sm">
          <p className="text-green-700">Henüz ses kaydı eklenmedi.</p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {audioList.map((audio) => (
            <article
              key={audio._id}
              className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-white/80 p-6 shadow-sm"
            >
              <CloverIcon className="absolute right-5 top-5 h-10 w-10 text-green-200" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    Ses Kaydı
                  </span>

                  {audio.isFavorite && <span>❤️</span>}
                </div>

                <h2 className="text-2xl font-semibold text-green-950">
                  {audio.title}
                </h2>

                {audio.description && (
                  <p className="mt-2 text-sm leading-6 text-green-700">
                    {audio.description}
                  </p>
                )}

                <div className="mt-6 rounded-3xl bg-green-50 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="mt-1 text-xs text-green-600">
                        Süre: {audio.duration || "Bilinmiyor"}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-green-700 shadow-sm">
                      🎙
                    </div>
                  </div>

                  {audio.mediaUrl ? (
                    <audio
                      controls
                      preload="none"
                      src={getMediaSrc(audio)}
                      className="w-full"
                    >
                      Tarayıcınız bu ses dosyasını desteklemiyor.
                    </audio>
                  ) : (
                    <p className="text-sm text-green-700">
                      Bu ses kaydı için medya dosyası eklenmemiş.
                    </p>
                  )}
                </div>

                {audio.tags?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {audio.tags.map((tag) => (
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

export default AudioPage;