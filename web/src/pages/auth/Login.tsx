import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/useAuthStore.ts';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    setIsPosting(true);
    const isValid = await login(email, password);
    console.log(isValid);

    if (isValid) {
      navigate('/dashboard');
      return;
    }

    setError('Correo y/o contraseña no válidos');
    setIsPosting(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo */}
      <div className="flex flex-1 flex-col justify-between bg-[#0f4c35] p-10 px-9">
        <div className="flex items-center gap-[10px]">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2ecc71]">
            <span className="text-lg font-black text-[#0f4c35]">+</span>
          </div>
          <span className="text-xl font-bold text-white">Nova Salud</span>
        </div>

        <div>
          <h2 className="mb-3 text-[28px] text-white">
            Sistema de gestión farmacéutica
          </h2>
          <p className="text-sm leading-relaxed text-white/55">
            Control de inventario, ventas y alertas de stock en tiempo real.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {[
            'Alertas de stock automáticas',
            'Registro de ventas por cajero',
            'Panel de inventario en vivo',
          ].map((txt) => (
            <div
              key={txt}
              className="flex items-center gap-2 rounded-[20px] border border-white/10 bg-white/5 px-3.5 py-2 text-[12px] text-white/70"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2ecc71]" />
              {txt}
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex flex-[1.2] flex-col justify-center bg-[#080808] p-12 px-10">
        <h1 className="mb-1 text-[26px] text-white">Bienvenido</h1>
        <p className="mb-8 text-[13px] text-gray-400">
          Ingresa tus credenciales para continuar
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-2.5 px-3.5 text-[13px] text-red-600">
            {error}
          </div>
        )}

        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-1.5 block text-[12px] font-medium tracking-[0.4px] text-gray-400 uppercase">
              Correo electrónico
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5 px-3.5 text-sm text-white outline-none focus:border-[#0f4c35] focus:ring-2 focus:ring-[#0f4c35]/20"
              placeholder="usuario@empresa.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <div className="mb-1.5 flex justify-between">
              <label className="text-[12px] font-medium tracking-[0.4px] text-gray-400 uppercase">
                Contraseña
              </label>
            </div>
            <input
              className="w-full rounded-lg border border-gray-300 p-2.5 px-3.5 text-sm text-white outline-none focus:border-[#0f4c35] focus:ring-2 focus:ring-[#0f4c35]/20"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className={`w-full rounded-lg py-3 text-sm font-medium text-white transition-colors ${isPosting ? 'cursor-not-allowed bg-gray-500' : 'bg-[#0f4c35] hover:bg-[#0a3626]'}`}
            disabled={isPosting}
            type="submit"
          >
            {isPosting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
