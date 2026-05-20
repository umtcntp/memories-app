import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await axiosClient.post("/auth/login", {
        email,
        password,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Giriş yapılırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ec] flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-[2rem] bg-white/80 border border-green-100 shadow-sm p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
            🍀
          </div>

          <h1 className="text-3xl font-semibold text-green-950">
            Can & Yonca
          </h1>

          <p className="mt-2 text-sm text-green-700">
            Anılarımıza giriş yap
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-green-950 mb-2">
              Email
            </label>
            <input
              className="w-full rounded-2xl border border-green-100 bg-white px-4 py-3 outline-none focus:border-green-300"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-950 mb-2">
              Şifre
            </label>
            <input
              className="w-full rounded-2xl border border-green-100 bg-white px-4 py-3 outline-none focus:border-green-300"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              placeholder="Şifren"
            />
          </div>

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;