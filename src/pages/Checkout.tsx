import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createWooCommerceOrder, getStoreCart, syncStoreCart, updateStoreCustomer, selectShippingRate, StoreCart, WooShippingRate } from "@/lib/woocommerce";
import { ShoppingBag, ArrowRight, CheckCircle2, Loader2, CreditCard, Truck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ARGENTINA_PROVINCES = [
    { code: "B", name: "Buenos Aires" },
    { code: "C", name: "Ciudad Autónoma de Buenos Aires (CABA)" },
    { code: "K", name: "Catamarca" },
    { code: "H", name: "Chaco" },
    { code: "U", name: "Chubut" },
    { code: "X", name: "Córdoba" },
    { code: "W", name: "Corrientes" },
    { code: "E", name: "Entre Ríos" },
    { code: "P", name: "Formosa" },
    { code: "Y", name: "Jujuy" },
    { code: "L", name: "La Pampa" },
    { code: "F", name: "La Rioja" },
    { code: "M", name: "Mendoza" },
    { code: "N", name: "Misiones" },
    { code: "Q", name: "Neuquén" },
    { code: "R", name: "Río Negro" },
    { code: "A", name: "Salta" },
    { code: "J", name: "San Juan" },
    { code: "D", name: "San Luis" },
    { code: "Z", name: "Santa Cruz" },
    { code: "S", name: "Santa Fe" },
    { code: "G", name: "Santiago del Estero" },
    { code: "V", name: "Tierra del Fuego" },
    { code: "T", name: "Tucumán" },
];

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, totalPrice, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState<any>(null);
    const [storeCart, setStoreCart] = useState<StoreCart | null>(null);
    const [nonce, setNonce] = useState<string>("");
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [selectedRateId, setSelectedRateId] = useState<string>("");
    const [isCartSynced, setIsCartSynced] = useState(false);
    const [cartToken, setCartToken] = useState<string>("");

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        phone: "",
    });

    // Update form if user logs in while on page
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || prev.firstName,
                lastName: user.lastName || prev.lastName,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    // Initialize Store Cart & Sync
    useEffect(() => {
        const init = async () => {
            try {
                console.log("Checkout: Initializing store cart...");
                setLoadingShipping(true);
                setIsCartSynced(false);
                const { cart: serverCart, nonce: n, cartToken: token } = await getStoreCart();
                setNonce(n);
                setCartToken(token);

                if (cart.length > 0) {
                    console.log("Checkout: Syncing local cart to server with token:", token);
                    const synced = await syncStoreCart(n, cart, token);
                    setStoreCart(synced);
                    console.log("Checkout: Sync complete.", {
                        items: synced.items?.length || 0,
                        itemCount: synced.items_count || 0
                    });
                } else {
                    setStoreCart(serverCart);
                }
                setIsCartSynced(true);
            } catch (e) {
                console.error("Store init error:", e);
            } finally {
                setLoadingShipping(false);
            }
        };
        init();
    }, [cart.length]);

    // Update shipping address when form data changes
    useEffect(() => {
        // Postcode is critical for Argentina shipping calculation
        const canCalculate = formData.address && formData.state && formData.city && formData.postcode;
        console.log("Check calculate:", {
            nonceExists: !!nonce,
            isCartSynced,
            canCalculate,
            address: formData.address,
            state: formData.state,
            city: formData.city,
            postcode: formData.postcode
        });

        const timer = setTimeout(async () => {
            if (nonce && isCartSynced && canCalculate) {
                console.log("Triggering address update for shipping calculation with postcode:", formData.postcode);
                setLoadingShipping(true);
                try {
                    // formData.state now holds the code directly
                    const stateCode = formData.state;
                    const updated = await updateStoreCustomer(nonce, {
                        shipping_address: {
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            company: "",
                            address_1: formData.address,
                            address_2: "",
                            city: formData.city,
                            state: stateCode,
                            postcode: formData.postcode,
                            country: "AR",
                            phone: formData.phone
                        },
                        billing_address: {
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            company: "",
                            address_1: formData.address,
                            address_2: "",
                            city: formData.city,
                            state: stateCode,
                            postcode: formData.postcode,
                            email: formData.email,
                            phone: formData.phone,
                            country: "AR"
                        }
                    }, cartToken);

                    console.log("Address updated successfully.", {
                        packages: updated.shipping_rates?.length || 0,
                        hasRates: (updated.shipping_rates?.[0]?.shipping_rates?.length || 0) > 0,
                        serverItems: updated.items?.length || 0,
                        itemCount: updated.items_count || 0
                    });

                    setStoreCart(updated);

                    if (!updated.shipping_rates || updated.shipping_rates.length === 0 || updated.shipping_rates[0].shipping_rates.length === 0) {
                        console.warn("Server returned no shipping rates for this address.");
                    }
                } catch (error: any) {
                    console.error("Error updating address:", error);
                    toast.error("No pudimos actualizar los costos de envío. Revisa tu dirección.");
                } finally {
                    setLoadingShipping(false);
                }
            } else if (canCalculate && !isCartSynced) {
                console.log("Waiting for cart sync before calculating shipping...");
            } else if (!canCalculate) {
                console.log("Cannot calculate shipping yet - missing address fields");
            }
        }, 1000); // 1s debounce to prevent too many API calls

        return () => clearTimeout(timer);
    }, [formData.address, formData.city, formData.state, formData.postcode, nonce, isCartSynced, cartToken]);

    if (cart.length === 0 && !orderComplete) {
        navigate("/productos");
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validate shipping selection
        const shippingPackages = storeCart?.shipping_rates || [];
        const rates = shippingPackages.length > 0 ? shippingPackages[0].shipping_rates : [];
        const selectedRate = rates.find(r => r.selected) || rates.find(r => r.rate_id === selectedRateId);

        if (rates.length > 0 && !selectedRate) {
            toast.error("Por favor selecciona un método de envío");
            return;
        }

        setLoading(true);

        const orderPayload: any = {
            payment_method: "bacs",
            payment_method_title: "Transferencia bancaria directa",
            set_paid: false,
            billing: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address,
                city: formData.city,
                state: formData.state, // Code
                postcode: formData.postcode,
                country: "AR",
                email: formData.email,
                phone: formData.phone,
            },
            shipping: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address,
                city: formData.city,
                state: formData.state, // Code
                postcode: formData.postcode,
                country: "AR",
            },
            line_items: cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
            shipping_lines: selectedRate ? [
                {
                    method_id: selectedRate.method_id,
                    method_title: selectedRate.name,
                    total: (parseInt(selectedRate.price, 10) / 100).toString()
                }
            ] : []
        };

        try {
            const order = await createWooCommerceOrder(orderPayload);
            setOrderComplete(order);
            clearCart();
            toast.success("¡Pedido realizado con éxito!");
        } catch (error: any) {
            toast.error(error.message || "Error al procesar el pedido");
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">¡Gracias por tu compra!</h1>
                        <p className="text-muted-foreground mb-6">
                            Tu pedido <span className="font-bold text-foreground">#{orderComplete.id}</span> ha sido recibido correctamente. Te hemos enviado un correo con los detalles.
                        </p>
                        <Button variant="hero" className="w-full" onClick={() => navigate("/")}>
                            Volver al inicio
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Helper to get rates for render
    const shippingPackages = storeCart?.shipping_rates || [];
    const currentRates = shippingPackages.length > 0 ? shippingPackages[0].shipping_rates : [];
    // Check if we have enough address to trigger calculation
    const canCalculate = formData.address && formData.state && formData.city;

    const selectedRate = currentRates.find(r => r.selected) || (selectedRateId ? currentRates.find(r => r.rate_id === selectedRateId) : null);
    const shippingCost = selectedRate ? parseInt(selectedRate.price, 10) / 100 : 0;
    const storeTotal = storeCart?.totals?.total_price ? parseInt(storeCart.totals.total_price, 10) / 100 : 0;
    const finalTotal = (storeTotal > 0 && selectedRate) ? storeTotal : (totalPrice + shippingCost);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 section-container py-12">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
                    {/* Form Section */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                            <ShoppingBag className="w-8 h-8 text-primary" />
                            Finalizar Pedido
                        </h1>

                        {!isAuthenticated && (
                            <div className="bg-secondary/20 border border-border rounded-xl p-4 mb-8 flex items-center justify-between">
                                <p className="text-sm">¿Ya tienes una cuenta?</p>
                                <Link to="/login" state={{ from: location }}>
                                    <Button variant="outline" size="sm">Iniciar Sesión</Button>
                                </Link>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Datos de Contacto</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Nombre</Label>
                                        <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Apellido</Label>
                                        <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono</Label>
                                        <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Dirección de Envío</h2>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ciudad</Label>
                                        <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">Provincia</Label>
                                        <Select
                                            value={formData.state}
                                            onValueChange={(val) => setFormData(prev => ({ ...prev, state: val }))}
                                        >
                                            <SelectTrigger id="state">
                                                <SelectValue placeholder="Selecciona..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ARGENTINA_PROVINCES.map(p => (
                                                    <SelectItem key={p.code} value={p.code}>{p.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postcode">C.P.</Label>
                                        <Input id="postcode" name="postcode" required value={formData.postcode} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Método de Envío
                                </h2>
                                {loadingShipping ? (
                                    <div className="flex items-center gap-2 text-muted-foreground bg-secondary/10 p-4 rounded-lg">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Calculando envíos para tu dirección...
                                    </div>
                                ) : currentRates.length > 0 ? (
                                    <RadioGroup value={selectedRateId || currentRates.find(r => r.selected)?.rate_id} onValueChange={async (val) => {
                                        setSelectedRateId(val);
                                        // Trigger server selection
                                        try {
                                            setLoadingShipping(true);
                                            const pkg = storeCart?.shipping_rates?.[0];
                                            if (pkg) {
                                                const updated = await selectShippingRate(nonce, pkg.package_id, val, cartToken);
                                                setStoreCart(updated);
                                            }
                                        } catch (e) { console.error(e); } finally { setLoadingShipping(false); }
                                    }}>
                                        <div className="space-y-3">
                                            {currentRates.map((rate) => {
                                                const cost = parseInt(rate.price, 10) / 100;
                                                return (
                                                    <div key={rate.rate_id} className={`flex items-start space-x-3 border rounded-lg p-3 cursor-pointer transition-colors ${selectedRateId === rate.rate_id || rate.selected ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/40'}`}>
                                                        <RadioGroupItem value={rate.rate_id} id={`rate-${rate.rate_id}`} className="mt-1" />
                                                        <div className="flex-1 cursor-pointer" onClick={() => {
                                                            // This click is handled by RadioGroup but sometimes Label blocks.
                                                            // We can let RadioGroup handle it.
                                                        }}>
                                                            <Label htmlFor={`rate-${rate.rate_id}`} className="font-medium cursor-pointer block">
                                                                {rate.name}
                                                            </Label>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {rate.description || rate.delivery_time}
                                                            </p>
                                                            <p className="text-sm font-semibold mt-1 text-primary">
                                                                {cost > 0 ? `$${cost.toLocaleString('es-AR')}` : 'Gratis'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </RadioGroup>
                                ) : (
                                    <div className="text-sm text-muted-foreground bg-secondary/10 p-4 rounded-lg">
                                        {canCalculate ?
                                            "No hay métodos de envío disponibles para esta dirección. Por favor revisa los datos o intenta con otra ubicación." :
                                            "Ingresa tu dirección, ciudad y provincia para ver los costos de envío."
                                        }
                                    </div>
                                )}
                            </section>

                            <div className="pt-6">
                                <Button type="submit" variant="hero" size="lg" className="w-full text-lg gap-2 h-14" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Confirmar Pedido (${finalTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })})
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Summary Section */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-muted-foreground">Cant: {item.quantity}</span>
                                                <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="mb-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground text-sm">
                                    <span>Envío</span>
                                    <span>
                                        {selectedRate ?
                                            `$${(parseInt(selectedRate.price, 10) / 100).toFixed(2)}` :
                                            (canCalculate ? (loadingShipping ? "Calculando..." : "No disponible") : " - ")
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span>${finalTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

