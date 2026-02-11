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
            // In a real WP setup without a custom registration endpoint, 
            // this would typically hit wp/v2/users if registration is open,
            // or a specific plugin endpoint. For now, we point to the requirement.
            const response = await fetch('https://koonetix.shop/wp-json/wp/v2/users/register', {
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al registrarse. Asegúrate de que el registro esté habilitado.");
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
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 py-12">
                <div className="max-w-md w-full">
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserPlus className="w-8 h-8 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold">Crear Cuenta</h1>
                            <p className="text-muted-foreground mt-2">Únete a la comunidad de Koonetix</p>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 flex items-center gap-2 mb-6 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Nombre</Label>
                                    <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Apellido</Label>
                                    <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Nombre de Usuario</Label>
                                <Input id="username" name="username" required value={formData.username} onChange={handleInputChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
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

                            <Button type="submit" variant="hero" className="w-full text-lg h-12 mt-4" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Registrando...
                                    </>
                                ) : (
                                    "Crear Cuenta"
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t text-center text-sm">
                            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
                            <Link to="/login" className="text-primary font-semibold hover:underline">Inicia sesión</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
