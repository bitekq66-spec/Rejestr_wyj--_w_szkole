export function EkranLogowania({
  email,
  password,
  rememberMe,
  showPassword,
  error,
  authNotice,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onToggleRememberMe,
  onSubmit,
  onPasswordReset,
}) {
  return (
    <div className="login-page d-grid">
      <aside className="login-aside">
        <a className="login-brand" href="/" aria-label="Rejestr Wyjść Uczniów">
          <img className="login-brand-logo" src="/logo-szkoly.png" alt="" />
          <span>Rejestr Wyjść Uczniów</span>
        </a>

        <div className="login-intro">
          <span className="login-eyebrow">Panel nauczyciela</span>
          <h1>Bezpieczna szkoła zaczyna się od dobrej informacji</h1>
          <p>Rejestruj wyjścia i powroty uczniów oraz miej czytelny wgląd w historię zdarzeń.</p>
        </div>

        <div className="login-school-name">
          <span aria-hidden="true" />
          Zespół Szkół nr 4 w Tychach
        </div>
      </aside>

      <main className="login-content d-flex align-items-center justify-content-center">
        <section className="login-card" aria-labelledby="login-title">
          <h2 id="login-title">Witaj ponownie</h2>
          <p className="login-subtitle">Zaloguj się, aby przejść do rejestru uczniów.</p>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Login lub adres e-mail</label>
              <div className="login-input-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                </svg>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  placeholder="nauczyciel@zs4.tychy.pl"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Hasło</label>
              <div className="login-input-wrap">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 1 1 8 0" />
                </svg>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  placeholder="Hasło"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-visibility"
                  onClick={onTogglePassword}
                  aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a9 9 0 0 0 4-.9" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input type="checkbox" checked={rememberMe} onChange={(event) => onToggleRememberMe(event.target.checked)} />
                <span>Zapamiętaj mnie</span>
              </label>
              <button type="button" className="forgot-password" onClick={onPasswordReset}>
                Nie pamiętasz hasła?
              </button>
            </div>

            <button type="submit" className="login-button w-100">
              Zaloguj się
            </button>
          </form>

          {error && <p className="error-message" role="alert">{error}</p>}
          {authNotice && <p className="auth-notice" role="status">{authNotice}</p>}

          <p className="login-help">Problem z logowaniem? Skontaktuj się z administratorem szkoły.</p>
        </section>
      </main>
    </div>
  )
}
