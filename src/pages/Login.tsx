import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const from = (location.state as any)?.from?.pathname || "/mi-cuenta";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(formData.username, formData.password);
            toast.success("¡Bienvenido de nuevo!");
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
            toast.error("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="h-screen flex">
                {/* Left Side - Login Form */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <div className="max-w-md w-full animate-fade-in">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg shadow-primary/20">
                                <LogIn className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Bienvenido de vuelta
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Ingresa a tu cuenta para continuar
                            </p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 flex items-start gap-3 mb-6 animate-shake">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-semibold">
                                    Usuario o Email
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    required
                                    placeholder="nombre@ejemplo.com"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="h-12 text-base bg-secondary/30 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-sm font-semibold">
                                        Contraseña
                                    </Label>
                                    <a
                                        href="#"
                                        className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="h-12 text-base pr-12 bg-secondary/30 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary/50"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant="hero"
                                className="w-full text-base h-12 font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5 mr-2" />
                                        Iniciar Sesión
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-border/50 text-center">
                            <p className="text-sm text-muted-foreground">
                                ¿No tienes cuenta?{" "}
                                <Link
                                    to="/register"
                                    className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                                >
                                    Regístrate ahora
                                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Decorative */}
                <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent p-12 items-center justify-center">
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
                        <div className="absolute top-1/3 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 text-white max-w-lg">
                        <div className="mb-8">
                            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                                ✨ Plataforma NFC + QR
                            </div>
                            <h2 className="text-5xl font-black mb-6 leading-tight">
                                Impulsa tu negocio con tecnología inteligente
                            </h2>
                            <p className="text-xl text-white/90 leading-relaxed">
                                Gestiona tus carteles digitales, obtén más reseñas y conecta con tus clientes de forma innovadora.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">📱</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Gestión Centralizada</h3>
                                    <p className="text-sm text-white/80">Controla todos tus carteles desde un solo lugar</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">⭐</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Más Reseñas</h3>
                                    <p className="text-sm text-white/80">Facilita que tus clientes dejen opiniones positivas</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Estadísticas en Tiempo Real</h3>
                                    <p className="text-sm text-white/80">Monitorea el rendimiento de tus campañas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
