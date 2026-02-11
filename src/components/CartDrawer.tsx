import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export function CartDrawer({ children }: { children?: React.ReactNode }) {
    const navigate = useNavigate();
    const { cart, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

    const handleCheckout = () => {
        navigate("/checkout");
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children || (
                    <Button variant="outline" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader className="pb-4">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Tu Carrito
                    </SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium mb-1">Tu carrito está vacío</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            ¡Parece que aún no has añadido nada! Explora nuestros productos para encontrar el cartel perfecto.
                        </p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="space-y-6 py-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-20 w-20 flex-shrink-0 bg-secondary/30 rounded-xl overflow-hidden">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</h4>
                                                <p className="text-sm font-medium text-primary mt-1">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                                                    <button
                                                        className="p-1 hover:bg-secondary text-muted-foreground transition-colors"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="px-3 text-xs font-medium">{item.quantity}</span>
                                                    <button
                                                        className="p-1 hover:bg-secondary text-muted-foreground transition-colors"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="pt-6 border-t border-border mt-auto">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-xl font-bold text-foreground">${totalPrice.toFixed(2)}</span>
                            </div>
                            <Separator className="mb-6" />
                            <Button className="w-full text-lg h-12 gap-2" variant="hero" onClick={handleCheckout}>
                                Finalizar Compra
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground mt-4">
                                Impuestos y envío calculados en la tienda oficial de WooCommerce.
                            </p>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
