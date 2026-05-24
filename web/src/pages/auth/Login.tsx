import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {useAuthStore} from "@/stores/auth/useAuthStore.ts";

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

    setIsPosting(true)
    const isValid = await login(email, password)

    if (isValid) {
      navigate('/dashboard')
      return
    }

    setError('Correo y/o contraseña no válidos')
    setIsPosting(false)
  }

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
          <h2 className="mb-3 text-[28px] text-white">Sistema de gestión farmacéutica</h2>
          <p className="text-sm leading-relaxed text-white/55">
            Control de inventario, ventas y alertas de stock en tiempo real.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {['Alertas de stock automáticas', 'Registro de ventas por cajero', 'Panel de inventario en vivo'].map((txt) => (
            <div
              key={txt}
              className="flex items-center gap-2 rounded-[20px] border border-white/10 bg-white/5 py-2 px-3.5 text-[12px] text-white/70"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#2ecc71] inline-block" />
              {txt}
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-[1.2] flex flex-col justify-center p-12 px-10">
        <h1 className="mb-1 text-[26px]">Bienvenido</h1>
        <p className="mb-8 text-[13px] text-gray-400">Ingresa tus credenciales para continuar</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-2.5 px-3.5 text-[13px] text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-5">
            <label className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.4px] text-gray-400">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@novasalud.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#0f4c35]/20 focus:border-[#0f4c35]"
            />
          </div>

          <div className="mb-5">
            <div className="mb-1.5 flex justify-between">
              <label className="text-[12px] font-medium uppercase tracking-[0.4px] text-gray-400">
                Contraseña
              </label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#0f4c35]/20 focus:border-[#0f4c35]"
            />
          </div>

          <button
            type="submit"
            disabled={isPosting}
            className={`w-full rounded-lg py-3 text-sm font-medium text-white transition-colors 
            ${isPosting ? 'cursor-not-allowed bg-gray-500' : 'bg-[#0f4c35] hover:bg-[#0a3626]'}`}
          >
            {isPosting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}