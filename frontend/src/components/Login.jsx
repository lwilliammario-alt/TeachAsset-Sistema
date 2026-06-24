import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import api from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [correo, setCorreo]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!correo.trim() || !password.trim()) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { correo, password });
      onLoginSuccess(response.data.token);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Credenciales incorrectas. Verifica e intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>

      {/* ═══════════════════════════════════════
          PANEL IZQUIERDO — Imagen + Branding
      ═══════════════════════════════════════ */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
      }}
        className="login-left-panel"
      >
        {/* Imagen de fondo */}
        <img
          src="/Img/ImagenFondo_Login.png"
          alt="Fondo"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />

        {/* Overlay oscuro degradado */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,30,0.55) 0%, rgba(10,10,40,0.80) 60%, rgba(5,5,20,0.95) 100%)',
        }} />

        {/* Logo empresa — top left */}
        <div style={{ position: 'relative', zIndex: 10, padding: '36px 40px 0' }}>
          <img
            src="/Img/Logo_Empresa.png"
            alt="TechAsset"
            style={{ height: 44, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
          />
        </div>

        {/* Texto central */}
        <div style={{ position: 'relative', zIndex: 10, padding: '0 40px 60px' }}>
          <p style={{
            color: '#a5b4fc', fontSize: 12, fontWeight: 700,
            letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10,
          }}>
            Bienvenido a
          </p>
          <h1 style={{
            color: '#ffffff', fontSize: 46, fontWeight: 900,
            lineHeight: 1.15, margin: '0 0 14px',
          }}>
            TECH
            <span style={{
              background: 'linear-gradient(90deg, #818cf8, #c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'block',
            }}>
              ASSET
            </span>
          </h1>
          <p style={{
            color: '#cbd5e1', fontSize: 14, lineHeight: 1.7,
            maxWidth: 340, margin: 0,
          }}>
            Sistema de Gestión de Inventario y Préstamo de Equipos Tecnológicos para
            <strong style={{ color: '#e2e8f0' }}> Innovatech Solutions S.A.C.</strong>
          </p>

          {/* Línea divisoria decorativa */}
          <div style={{
            width: 56, height: 3, borderRadius: 99,
            background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
            marginTop: 24,
          }} />
        </div>


      </div>

      {/* ═══════════════════════════════════════
          PANEL DERECHO — Formulario
      ═══════════════════════════════════════ */}
      <div style={{
        width: '100%', maxWidth: 460,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '48px 40px',
        background: '#ffffff',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.10)',
      }}>
        <div style={{ width: '100%', maxWidth: 340 }}>

          {/* Logo Login + Título */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', marginBottom: 32,
          }}>
            <img
              src="/Img/Logo_Login.png"
              alt="Login"
              style={{
                width: 88, height: 88,
                objectFit: 'contain', marginBottom: 18,
                filter: 'drop-shadow(0 6px 20px rgba(99,102,241,0.40))',
              }}
            />
            <h2 style={{
              color: '#0f172a', fontSize: 22, fontWeight: 900,
              margin: 0, textAlign: 'center', letterSpacing: '-0.3px',
            }}>
              Iniciar Sesión
            </h2>
            <p style={{
              color: '#64748b', fontSize: 13,
              margin: '5px 0 0', textAlign: 'center',
            }}>
              Sistema de Gestión TechAsset
            </p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div style={{
              background: '#fff1f2', border: '1.5px solid #fecdd3',
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', alignItems: 'flex-start', gap: 10,
              color: '#be123c', fontSize: 13, marginBottom: 20,
            }}>
              <ShieldAlert size={17} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Campo: Usuario */}
            <div>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 700,
                color: '#6b7280', letterSpacing: 1.5,
                textTransform: 'uppercase', marginBottom: 7,
              }}>
                Usuario
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: 13,
                  top: '50%', transform: 'translateY(-50%)', color: '#9ca3af',
                }} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Digite su correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 38, paddingRight: 14,
                    paddingTop: 12, paddingBottom: 12,
                    border: '1.5px solid #e5e7eb', borderRadius: 10,
                    background: '#f8fafc', fontSize: 14, color: '#0f172a',
                    outline: 'none', transition: 'border-color .2s, box-shadow .2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Campo: Contraseña */}
            <div>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 700,
                color: '#6b7280', letterSpacing: 1.5,
                textTransform: 'uppercase', marginBottom: 7,
              }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: 13,
                  top: '50%', transform: 'translateY(-50%)', color: '#9ca3af',
                }} />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Digite su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 38, paddingRight: 42,
                    paddingTop: 12, paddingBottom: 12,
                    border: '1.5px solid #e5e7eb', borderRadius: 10,
                    background: '#f8fafc', fontSize: 14, color: '#0f172a',
                    outline: 'none', transition: 'border-color .2s, box-shadow .2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {/* Toggle mostrar contraseña */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 13,
                    top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#9ca3af', padding: 0,
                    lineHeight: 0,
                  }}
                >
                  {showPass
                    ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Botón Ingresar */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                marginTop: 4,
                borderRadius: 10, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? '#c7d2fe'
                  : 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                letterSpacing: 0.3,
                boxShadow: loading ? 'none' : '0 4px 18px rgba(99,102,241,0.38)',
                transition: 'all .2s',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
              }}
            >
              {loading
                ? <>
                    <svg style={{ animation: 'ta-spin 1s linear infinite', width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: .25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path style={{ opacity: .75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Validando...
                  </>
                : 'Ingresar'
              }
            </button>
          </form>


        </div>
      </div>

      {/* Estilos globales del Login */}
      <style>{`
        @keyframes ta-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* Ocultar panel izquierdo en móvil */
        .login-left-panel { display: none; }
        @media (min-width: 768px) {
          .login-left-panel { display: flex; }
        }
      `}</style>
    </div>
  );
}
