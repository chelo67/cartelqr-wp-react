import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [userLogin, setUserLogin] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch('https://koonetix.shop/wp-json/custom/v1/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_login: userLogin,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || data.code || "Error al enviar el correo";
                throw new Error(errorMessage);
            }

            setSuccess(true);
            toast.success("Correo enviado con éxito");
        } catch (err: any) {
            setError(err.message || "Error al procesar la solicitud");
            toast.error(err.message || "Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="h-screen flex">
                {/* Left Side - Form */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                    <div className="max-w-md w-full animate-fade-in">
                        <div className="mb-8">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Volver al login
                            </Link>

                            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 shadow-lg shadow-primary/20">
                                <KeyRound className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                ¿Olvidaste tu contraseña?
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                No te preocupes, te enviaremos instrucciones para restablecerla
                            </p>
                        </div>

                        {success ? (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-xl p-6 animate-fade-in">
                                <div className="flex items-start gap-3 mb-4">
                                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">¡Correo enviado!</h3>
                                        <p className="text-sm">
                                            Hemos enviado un correo a tu dirección de email con instrucciones para restablecer tu contraseña.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-green-500/20">
                                    <p className="text-sm mb-4">
                                        Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
                                    </p>
                                    <Link to="/login">
                                        <Button variant="outline" className="w-full">
                                            Volver al login
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                {error && (
                                    <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 flex items-start gap-3 mb-6 animate-shake">
                                        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="userLogin" className="text-sm font-semibold">
                                            Email o Nombre de Usuario
                                        </Label>
                                        <Input
                                            id="userLogin"
                                            name="userLogin"
                                            required
                                            placeholder="nombre@ejemplo.com"
                                            value={userLogin}
                                            onChange={(e) => {
                                                setUserLogin(e.target.value);
                                                if (error) setError("");
                                            }}
                                            className="h-12 text-base bg-secondary/30 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Ingresa el email o nombre de usuario asociado a tu cuenta
                                        </p>
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
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound className="w-5 h-5 mr-2" />
                                                Enviar instrucciones
                                            </>
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        ¿Recordaste tu contraseña?{" "}
                                        <Link
                                            to="/login"
                                            className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1 group"
                                        >
                                            Inicia sesión
                                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Side - Decorative */}
                <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-accent/90 p-12 items-center justify-center">
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
                                🔒 Seguridad Primero
                            </div>
                            <h2 className="text-5xl font-black mb-6 leading-tight">
                                Tu cuenta está protegida
                            </h2>
                            <p className="text-xl text-white/90 leading-relaxed">
                                Recupera el acceso a tu cuenta de forma segura en pocos pasos.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">📧</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Correo Instantáneo</h3>
                                    <p className="text-sm text-white/80">Recibirás las instrucciones en tu email</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">🔐</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Enlace Seguro</h3>
                                    <p className="text-sm text-white/80">Enlace único y temporal para restablecer</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">Proceso Rápido</h3>
                                    <p className="text-sm text-white/80">Recupera tu acceso en menos de 2 minutos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
