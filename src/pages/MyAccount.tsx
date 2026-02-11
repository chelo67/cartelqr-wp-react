import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
    User, Mail, ShieldCheck, ShoppingBag, LogOut, Package,
    Calendar, MapPin, LayoutDashboard, Download, Settings,
    ChevronRight, ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWooCommerceOrders, getWooCommerceCustomer } from "@/lib/woocommerce";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyAccount() {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [customer, setCustomer] = useState<any>(null);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingCustomer, setLoadingCustomer] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user?.email) {
                try {
                    const ordersData = await getWooCommerceOrders(user.email);
                    setOrders(ordersData);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    toast.error("Error al cargar tus pedidos");
                } finally {
                    setLoadingOrders(false);
                }
            } else {
                setLoadingOrders(false);
            }
        };

        const fetchCustomer = async () => {
            if (user?.email) {
                try {
                    const customerData = await getWooCommerceCustomer(user.email);
                    setCustomer(customerData);
                } catch (error) {
                    console.error("Error fetching customer details:", error);
                } finally {
                    setLoadingCustomer(false);
                }
            } else {
                setLoadingCustomer(false);
            }
        };

        if (isAuthenticated && user) {
            fetchOrders();
            fetchCustomer();
        }
    }, [isAuthenticated, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const renderDashboard = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-secondary/20 p-6 rounded-2xl border border-border">
                <h2 className="text-xl font-bold mb-2">¡Hola, {user?.displayName}!</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Desde el panel de tu cuenta podés ver tus pedidos recientes, gestionar tus direcciones de envío y facturación y editar tu contraseña y los detalles de tu cuenta.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={() => {
                        const trigger = document.getElementById('trigger-pedidos');
                        if (trigger) (trigger as HTMLElement).click();
                    }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-all group text-left"
                >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <span className="font-bold block">Ver Pedidos</span>
                        <span className="text-xs text-muted-foreground">{orders.length} pedidos realizados</span>
                    </div>
                </button>

                <button
                    onClick={() => {
                        const trigger = document.getElementById('trigger-direcciones');
                        if (trigger) (trigger as HTMLElement).click();
                    }}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-all group text-left"
                >
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <span className="font-bold block">Direcciones</span>
                        <span className="text-xs text-muted-foreground">Envío y Facturación</span>
                    </div>
                </button>
            </div>
        </div>
    );

    const renderOrders = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Tus Pedidos
            </h2>

            {loadingOrders ? (
                <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-border">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Cargando historial de pedidos...</p>
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4 bg-secondary/10 flex flex-wrap justify-between items-center gap-4 border-b border-border">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider leading-none mb-1">Pedido</p>
                                        <p className="font-black">#{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider leading-none mb-1">Fecha</p>
                                        <p className="font-medium text-sm">{new Date(order.date_created).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase border ${order.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                                            order.status === 'processing' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                                                'bg-orange-500/10 text-orange-600 border-orange-500/20'
                                        }`}>
                                        {order.status}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider leading-none mb-1">Total</p>
                                        <p className="font-black text-primary">${parseFloat(order.total).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-3">
                                {order.line_items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 max-w-[70%]">
                                            <div className="w-8 h-8 bg-secondary/30 rounded flex items-center justify-center flex-shrink-0">
                                                <Package className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                            <span className="font-medium truncate">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 tabular-nums">
                                            <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                                            <span className="font-bold">${parseFloat(item.total).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-secondary/10 rounded-2xl border border-dashed border-border">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No has realizado ningún pedido todavía</p>
                    <Button variant="hero" size="sm" className="mt-4" onClick={() => navigate("/productos")}>
                        Ir a la tienda
                    </Button>
                </div>
            )}
        </div>
    );

    const renderAddresses = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Tus Direcciones
            </h2>
            <p className="text-sm text-muted-foreground">
                Las siguientes direcciones se utilizarán en la página de pago por defecto.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Billing Address */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold flex items-center gap-2">Dirección de facturación</h3>
                    </div>
                    {loadingCustomer ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-secondary/50 rounded w-3/4"></div>
                            <div className="h-4 bg-secondary/50 rounded w-1/2"></div>
                            <div className="h-4 bg-secondary/50 rounded w-2/3"></div>
                        </div>
                    ) : customer?.billing ? (
                        <div className="text-sm space-y-1 text-muted-foreground italic">
                            <p className="font-bold text-foreground not-italic">{customer.billing.first_name} {customer.billing.last_name}</p>
                            <p>{customer.billing.address_1}</p>
                            {customer.billing.address_2 && <p>{customer.billing.address_2}</p>}
                            <p>{customer.billing.city}, {customer.billing.state} {customer.billing.postcode}</p>
                            <p>{customer.billing.country}</p>
                            <p className="pt-2">{customer.billing.email}</p>
                            <p>{customer.billing.phone}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No has configurado esta dirección todavía.</p>
                    )}
                </div>

                {/* Shipping Address */}
                <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold flex items-center gap-2">Dirección de envío</h3>
                    </div>
                    {loadingCustomer ? (
                        <div className="space-y-2 animate-pulse">
                            <div className="h-4 bg-secondary/50 rounded w-3/4"></div>
                            <div className="h-4 bg-secondary/50 rounded w-1/2"></div>
                            <div className="h-4 bg-secondary/50 rounded w-2/3"></div>
                        </div>
                    ) : customer?.shipping ? (
                        <div className="text-sm space-y-1 text-muted-foreground italic">
                            <p className="font-bold text-foreground not-italic">{customer.shipping.first_name} {customer.shipping.last_name}</p>
                            <p>{customer.shipping.address_1}</p>
                            {customer.shipping.address_2 && <p>{customer.shipping.address_2}</p>}
                            <p>{customer.shipping.city}, {customer.shipping.state} {customer.shipping.postcode}</p>
                            <p>{customer.shipping.country}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No has configurado esta dirección todavía.</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderDetails = () => (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Detalles de la Cuenta
            </h2>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-1 block">Nombre</label>
                        <div className="p-3 bg-secondary/20 border border-border rounded-xl font-medium">
                            {user?.firstName || "No definido"}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-1 block">Apellidos</label>
                        <div className="p-3 bg-secondary/20 border border-border rounded-xl font-medium">
                            {user?.lastName || "No definido"}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-1 block">Nombre a mostrar</label>
                    <div className="p-3 bg-secondary/20 border border-border rounded-xl font-medium">
                        {user?.displayName}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Este será el nombre que aparecerá en la sección de la cuenta y en las reseñas.</p>
                </div>

                <div>
                    <label className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-1 block">Correo electrónico</label>
                    <div className="p-3 bg-secondary/20 border border-border rounded-xl font-medium flex items-center justify-between">
                        {user?.email}
                        <Mail className="w-4 h-4 text-muted-foreground opacity-30" />
                    </div>
                </div>

                <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-bold flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Seguridad de la cuenta
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                        Tu sesión está protegida mediante autenticación segura JWT vinculada a koonetix.shop.
                    </p>
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold uppercase transition-all" disabled>
                        Cambiar Contraseña
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 section-container py-12 sm:py-20">
                <div className="max-w-5xl mx-auto">
                    <Tabs defaultValue="escritorio" className="w-full">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Sidebar Navigation */}
                            <div className="w-full md:w-72 md:sticky md:top-24 gap-4 flex flex-col">
                                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hidden md:block">
                                    <div className="flex flex-col items-center text-center mb-6">
                                        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-3xl font-black shadow-lg mb-4">
                                            {user?.displayName?.[0] || "U"}
                                        </div>
                                        <h3 className="font-black text-lg truncate w-full">{user?.displayName}</h3>
                                        <p className="text-xs text-muted-foreground truncate w-full">{user?.email}</p>
                                    </div>
                                </div>

                                <div className="bg-card border border-border rounded-2xl p-2 shadow-sm w-full overflow-hidden">
                                    <TabsList className="flex flex-col w-full h-auto bg-transparent gap-1">
                                        <TabsTrigger id="trigger-escritorio" value="escritorio" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl font-bold transition-all text-sm">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Escritorio
                                        </TabsTrigger>
                                        <TabsTrigger id="trigger-pedidos" value="pedidos" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl font-bold transition-all text-sm">
                                            <ShoppingBag className="w-4 h-4" />
                                            Pedidos
                                        </TabsTrigger>
                                        <TabsTrigger id="trigger-descargas" value="descargas" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl font-bold transition-all text-sm">
                                            <Download className="w-4 h-4" />
                                            Descargas
                                        </TabsTrigger>
                                        <TabsTrigger id="trigger-direcciones" value="direcciones" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl font-bold transition-all text-sm">
                                            <MapPin className="w-4 h-4" />
                                            Direcciones
                                        </TabsTrigger>
                                        <TabsTrigger id="trigger-detalles" value="detalles" className="w-full justify-start gap-3 px-4 py-3 h-auto data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl font-bold transition-all text-sm">
                                            <Settings className="w-4 h-4" />
                                            Detalles de la cuenta
                                        </TabsTrigger>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-all mt-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Cerrar Sesión
                                        </button>
                                    </TabsList>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 w-full">
                                <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm min-h-[500px]">
                                    <TabsContent value="escritorio" className="mt-0">{renderDashboard()}</TabsContent>
                                    <TabsContent value="pedidos" className="mt-0">{renderOrders()}</TabsContent>
                                    <TabsContent value="descargas" className="mt-0">
                                        <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-dashed border-border animate-fade-in">
                                            <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                            <p className="font-bold">No hay descargas disponibles todavía</p>
                                            <Button variant="link" onClick={() => navigate("/productos")} className="mt-2 text-primary">Explorar productos digitales</Button>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="direcciones" className="mt-0">{renderAddresses()}</TabsContent>
                                    <TabsContent value="detalles" className="mt-0">{renderDetails()}</TabsContent>
                                </div>
                            </div>
                        </div>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
}
