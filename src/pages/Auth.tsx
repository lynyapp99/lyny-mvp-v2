import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";

type FieldErrors = Partial<Record<"username" | "email" | "password" | "confirmPassword", string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [successName, setSuccessName] = useState<string | null>(null);

  const redirectParam = searchParams.get("redirect");
  const from = redirectParam || (location.state as { from?: string } | null)?.from || "/home";

  // Validation
  const errors: FieldErrors = {};
  if (mode === "signup") {
    if (!username.trim()) errors.username = "Informe seu nome";
    else if (username.trim().length < 2) errors.username = "Nome muito curto (mín. 2 caracteres)";
  }
  if (!email) errors.email = "Informe seu e-mail";
  else if (!emailRegex.test(email)) errors.email = "E-mail inválido";
  if (!password) errors.password = "Informe uma senha";
  else if (password.length < 6) errors.password = "Mínimo de 6 caracteres";
  if (mode === "signup") {
    if (!confirmPassword) errors.confirmPassword = "Confirme a senha";
    else if (password !== confirmPassword) errors.confirmPassword = "As senhas não coincidem";
  }

  const isValid = Object.keys(errors).length === 0;
  const showError = (field: keyof FieldErrors) =>
    (touched[field] || formError !== null) && errors[field];

  // Redirect on session, except when showing success screen
  useEffect(() => {
    if (session && !successName) {
      (async () => {
        const { data } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .maybeSingle();
        if (data?.onboarding_completed) {
          navigate(from, { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }
      })();
    }
  }, [session, from, navigate, successName]);

  // After success screen, navigate to onboarding
  useEffect(() => {
    if (!successName) return;
    const t = setTimeout(() => navigate("/onboarding", { replace: true }), 2000);
    return () => clearTimeout(t);
  }, [successName, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setTouched({ username: true, email: true, password: true, confirmPassword: true });
    if (!isValid) return;

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${from}`,
            data: {
              username: username.trim(),
              display_name: username.trim(),
            },
          },
        });
        if (error) throw error;
        setSuccessName(username.trim());
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Falha na autenticação";
      setFormError(message);
      toast({ title: "Erro", description: message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setFormError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + from,
      });
      if (result.error) {
        const message = result.error instanceof Error ? result.error.message : "Falha ao entrar com Google";
        setFormError(message);
        toast({ title: "Erro", description: message, variant: "destructive" });
      }
    } finally {
      setBusy(false);
    }
  };

  // Success screen
  if (successName) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center animate-in fade-in duration-500">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center animate-in zoom-in-50 duration-500">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
              <Check size={32} className="text-primary-foreground" strokeWidth={3} />
            </div>
          </div>
          <h1 className="font-display font-semibold text-3xl text-foreground">Conta criada!</h1>
          <p className="text-muted-foreground mt-2">
            Bem-vindo ao Lyny, <span className="text-foreground">{successName}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-sm p-6 border border-border">
        <div className="text-center mb-6">
          <img src="/lyny-logo.png" alt="lyny" className="h-10 w-auto mx-auto mb-3" />
          <h1 className="font-display font-semibold text-2xl text-foreground">
            {mode === "signin" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Entre nas suas timelines" : "Comece a guardar suas memórias"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "signup" && (
            <Field
              id="username"
              label="Nome"
              value={username}
              onChange={setUsername}
              onBlur={() => setTouched((t) => ({ ...t, username: true }))}
              placeholder="Seu nome"
              autoComplete="name"
              disabled={busy}
              error={showError("username") ? errors.username : undefined}
            />
          )}

          <Field
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            disabled={busy}
            error={showError("email") ? errors.email : undefined}
          />

          <Field
            id="password"
            label="Senha"
            type="password"
            value={password}
            onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            disabled={busy}
            error={showError("password") ? errors.password : undefined}
            hint={mode === "signup" ? "Mínimo de 6 caracteres" : undefined}
          />

          {mode === "signup" && (
            <Field
              id="confirmPassword"
              label="Confirmar senha"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
              autoComplete="new-password"
              disabled={busy}
              error={
                confirmPassword && password !== confirmPassword
                  ? "As senhas não coincidem"
                  : showError("confirmPassword")
                    ? errors.confirmPassword
                    : undefined
              }
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={busy || (mode === "signup" && !isValid)}
          >
            {busy ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                {mode === "signup" ? "Criando sua conta..." : "Entrando..."}
              </span>
            ) : mode === "signin" ? (
              "Entrar"
            ) : (
              "Criar conta"
            )}
          </Button>

          {formError && (
            <div className="flex items-start gap-2 p-3 rounded-app bg-destructive/10 border border-destructive/30">
              <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive leading-snug">{formError}</p>
            </div>
          )}
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={busy}>
          Continuar com Google
        </Button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setFormError(null);
            setTouched({});
          }}
          className="w-full text-sm text-muted-foreground hover:text-foreground mt-4"
          disabled={busy}
        >
          {mode === "signin" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </GlassCard>
    </div>
  );
};

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

const Field = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  autoComplete,
  disabled,
  error,
  hint,
}: FieldProps) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      aria-invalid={!!error}
      className={error ? "border-destructive focus-visible:ring-destructive/30" : ""}
    />
    {error ? (
      <p className="text-xs text-destructive mt-1.5">{error}</p>
    ) : hint ? (
      <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>
    ) : null}
  </div>
);

export default Auth;
