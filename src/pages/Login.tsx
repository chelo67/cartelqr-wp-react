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
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full">
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogIn className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
                            <p className="text-muted-foreground mt-2">Ingresa a tu cuenta de Koonetix</p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 flex items-center gap-2 mb-6 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username">Usuario o Email</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    required
                                    placeholder="Tu usuario"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <a href="#" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="pr-10"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" variant="hero" className="w-full text-lg h-12" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    "Entrar"
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t text-center text-sm">
                            <span className="text-muted-foreground">¿No tienes cuenta? </span>
                            <Link to="/register" className="text-primary font-semibold hover:underline">Regístrate ahora</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
