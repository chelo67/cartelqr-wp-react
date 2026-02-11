import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });

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
            // Use custom registration endpoint
            const response = await fetch('https://koonetix.shop/wp-json/custom/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle WordPress error format
                const errorMessage = data.message || data.code || "Error al registrarse";
                throw new Error(errorMessage);
            }

            toast.success("¡Cuenta creada con éxito! Ya puedes iniciar sesión.");
            navigate("/login");
        } catch (err: any) {
            setError(err.message || "Error al registrarse");
            toast.error(err.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="h-screen flex">
                {/* Left Side - Registration Form */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <div className="max-w-md w-full animate-fade-in">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg shadow-primary/20">
                                <UserPlus className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Únete a Koonetix
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Crea tu cuenta y comienza a gestionar tus carteles digitales
                            </p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 flex items-start gap-3 mb-6 animate-shake">
                                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-semibold">
                                        Nombre
                                    </Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        required
                                        placeholder="Juan"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="h-11 text-base bg-secondary/30 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-semibold">
                                        Apellido
                                    </Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        required
                                        placeholder="Pérez"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="h-11 text-base bg-secondary/30 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-sm font-semibold">
                                    Nombre de Usuario
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    required
                                    placeholder="juanperez"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="h-11 text-base bg-secondary/30 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="nombre@ejemplo.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="h-11 text-base bg-secondary/30 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-semibold">
                                    Contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="h-11 text-base pr-12 bg-secondary/30 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                                <p className="text-xs text-muted-foreground">
                                    Mínimo 8 caracteres
                                </p>
                            </div>

                            <Button
                                type="submit"
                                variant="hero"
                                className="w-full text-base h-12 font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all mt-6"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Crear Cuenta
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-border/50 text-center">
                            <p className="text-sm text-muted-foreground">
                                ¿Ya tienes cuenta?{" "}
                                <Link
                                    to="/login"
                                    className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                                >
                                    Inicia sesión
                                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Decorative */}
                <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-accent via-accent/90 to-primary p-12 items-center justify-center">
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
                                🚀 Comienza Gratis
                            </div>
                            <h2 className="text-5xl font-black mb-6 leading-tight">
                                Todo lo que necesitas para crecer
                            </h2>
                            <p className="text-xl text-white/90 leading-relaxed">
                                Únete a cientos de negocios que ya están usando Koonetix para mejorar su presencia digital.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Sin Costos Ocultos</h3>
                                    <p className="text-sm text-white/80">Comienza gratis y escala cuando lo necesites</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Fácil de Usar</h3>
                                    <p className="text-sm text-white/80">Interfaz intuitiva, sin conocimientos técnicos</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Soporte 24/7</h3>
                                    <p className="text-sm text-white/80">Estamos aquí para ayudarte cuando lo necesites</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
