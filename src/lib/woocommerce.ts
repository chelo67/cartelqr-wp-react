
export interface WooImage {
  src: string;
  alt: string;
}

export interface WooProduct {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  sku: string;
  images: WooImage[];
  categories: { id: number; name: string; slug: string }[];
}

const config = {
  url: 'https://koonetix.shop/wp-json/wc/v3/products',
  ck: 'ck_a1fd685caa446f9d99db0c931955724baa706adb',
  cs: 'cs_30abbbe715438bec9d9335ca27a3a6f978265745'
};

export async function getWooCommerceProducts(): Promise<WooProduct[]> {
  const auth = btoa(`${config.ck}:${config.cs}`);
  const response = await fetch(config.url, {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

export async function getWooCommerceProductById(id: string): Promise<WooProduct> {
  const auth = btoa(`${config.ck}:${config.cs}`);
  const response = await fetch(`${config.url}/${id}`, {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

export async function createWooCommerceOrder(orderPayload: any): Promise<any> {
  const auth = btoa(`${config.ck}:${config.cs}`);
  const response = await fetch('https://koonetix.shop/wp-json/wc/v3/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderPayload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getWooCommerceOrders(email: string, customerId?: number): Promise<any[]> {
  const auth = btoa(`${config.ck}:${config.cs}`);

  // billing_email is the correct parameter for filtering orders by email in WC v3
  const queryParam = customerId ? `customer=${customerId}` : `billing_email=${encodeURIComponent(email)}`;

  const url = `https://koonetix.shop/wp-json/wc/v3/orders?${queryParam}&status=any&per_page=100&orderby=date&order=desc`;
  console.log('Fetching WooCommerce orders from:', url);

  const response = await fetch(url, {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  const orders = await response.json();
  console.log('Orders received from API:', orders.length, orders);

  // Double-check: filter by email on client side as extra security measure
  // This ensures only orders matching the user's email are returned
  if (email && !customerId) {
    return orders.filter((order: any) =>
      order.billing?.email?.toLowerCase() === email.toLowerCase()
    );
  }

  return orders;
}

export async function getWooCommerceCustomer(email: string): Promise<any> {
  const auth = btoa(`${config.ck}:${config.cs}`);
  const response = await fetch(`https://koonetix.shop/wp-json/wc/v3/customers?email=${email}`, {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.statusText}`);
  }

  const customers = await response.json();
  console.log('Customer search for', email, 'returned:', customers.length, 'results');
  return customers.length > 0 ? customers[0] : null;
}

export async function updateWooCommerceCustomer(id: number, data: any): Promise<any> {
  const auth = btoa(`${config.ck}:${config.cs}`);
  const response = await fetch(`https://koonetix.shop/wp-json/wc/v3/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  }

  return response.json();
}

export interface WooShippingRate {
  rate_id: string;
  name: string;
  description: string;
  delivery_time: string;
  price: string;
  taxes: string;
  instance_id: number;
  method_id: string;
  meta_data: any[];
  selected: boolean;
  currency_code: string;
  currency_symbol: string;
}

export interface WooShippingPackage {
  package_id: number;
  name: string;
  destination: any;
  items: any[];
  shipping_rates: WooShippingRate[];
}

export interface StoreCart {
  totals: {
    total_price: string;
    total_tax: string;
    total_shipping: string;
  };
  shipping_rates: WooShippingPackage[];
  items: any[];
  items_count: number;
  items_weight: number;
  needs_payment: boolean;
  needs_shipping: boolean;
}

const storeApiUrl = 'https://koonetix.shop/wp-json/wc/store/v1';

/**
 * Maps Argentine state names to their standard 2-letter codes for WooCommerce
 */
export function getArgentinaStateCode(stateName: string): string {
  const states: Record<string, string> = {
    "buenos aires": "B",
    "caba": "C",
    "ciudad autonoma de buenos aires": "C",
    "catamarca": "K",
    "chaco": "H",
    "chubut": "U",
    "cordoba": "X",
    "corrientes": "W",
    "entre rios": "E",
    "formosa": "P",
    "jujuy": "Y",
    "la pampa": "L",
    "la rioja": "F",
    "mendoza": "M",
    "misiones": "N",
    "neuquen": "Q",
    "rio negro": "R",
    "salta": "A",
    "san juan": "J",
    "san luis": "D",
    "santa cruz": "Z",
    "santa fe": "S",
    "santiago del estero": "G",
    "tierra del fuego": "V",
    "tucuman": "T"
  };

  const normalized = stateName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  return states[normalized] || stateName; // Fallback to original if not found
}

export async function getStoreCart(cartToken?: string): Promise<{ cart: StoreCart; nonce: string; cartToken: string }> {
  const headers: Record<string, string> = {};
  if (cartToken) {
    headers['Cart-Token'] = cartToken;
  }

  const response = await fetch(`${storeApiUrl}/cart`, {
    headers,
    credentials: 'include'
  });

  // Try to get nonce from headers first
  let nonce = response.headers.get('x-wc-store-api-nonce') || response.headers.get('nonce') || '';

  // Capture or update Cart-Token for session persistence on localhost
  const newCartToken = response.headers.get('cart-token') || cartToken || '';

  // Fallback: Fetch nonce from custom side-channel endpoint if header is missing
  if (!nonce) {
    try {
      const nonceResponse = await fetch('https://koonetix.shop/wp-json/custom/v1/store-nonce', {
        credentials: 'include'
      });
      if (nonceResponse.ok) {
        const nonceData = await nonceResponse.json();
        nonce = nonceData.nonce;
        console.log('Fetched side-channel nonce:', nonce);
      }
    } catch (e) {
      console.error('Failed to fetch side-channel nonce:', e);
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch store cart: ${response.statusText}`);
  }

  const cart = await response.json();
  return { cart, nonce, cartToken: newCartToken };
}

export async function updateStoreCustomer(nonce: string, data: any, cartToken?: string): Promise<StoreCart> {
  console.log('UpdateStoreCustomer: Sending payload:', JSON.stringify(data, null, 2));

  const headers: Record<string, string> = {
    'X-WC-Store-API-Nonce': nonce,
    'Nonce': nonce,
    'Content-Type': 'application/json'
  };

  if (cartToken) {
    headers['Cart-Token'] = cartToken;
  }

  const response = await fetch(`${storeApiUrl}/cart/update-customer`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    credentials: 'include'
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('UpdateStoreCustomer: Server rejected update:', errorData);
    throw new Error(errorData.message || `Error updating customer: ${response.statusText}`);
  }

  const updatedCart = await response.json();
  console.log('UpdateStoreCustomer: Success. Rates count:', updatedCart.shipping_rates?.length || 0);
  return updatedCart;
}

export async function addItemToStoreCart(nonce: string, productId: number, quantity: number, cartToken?: string): Promise<StoreCart> {
  const headers: Record<string, string> = {
    'X-WC-Store-API-Nonce': nonce,
    'Nonce': nonce,
    'Content-Type': 'application/json'
  };

  if (cartToken) {
    headers['Cart-Token'] = cartToken;
  }

  const response = await fetch(`${storeApiUrl}/cart/add-item`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: productId,
      quantity: quantity
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('AddItemToStoreCart: Failed:', err);
    throw new Error(`Failed to add item ${productId}: ${err.message || response.statusText}`);
  }

  return response.json();
}

export async function removeStoreCartItem(nonce: string, key: string, cartToken?: string): Promise<StoreCart> {
  const headers: Record<string, string> = {
    'X-WC-Store-API-Nonce': nonce,
    'Nonce': nonce,
    'Content-Type': 'application/json'
  };

  if (cartToken) {
    headers['Cart-Token'] = cartToken;
  }

  const response = await fetch(`${storeApiUrl}/cart/remove-item`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      key: key
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    console.warn('RemoveStoreCartItem: Failed to remove item', key);
  }

  return response.json();
}

export async function syncStoreCart(nonce: string, localCartItems: any[], cartToken?: string): Promise<StoreCart> {
  console.log('SyncStoreCart: Starting sync for', localCartItems.length, 'items');
  let { cart: currentCart } = await getStoreCart(cartToken);

  // 1. Clear existing server cart items to avoid duplicates
  if (currentCart.items && currentCart.items.length > 0) {
    console.log('SyncStoreCart: Clearing', currentCart.items.length, 'existing server items');
    for (const item of currentCart.items) {
      if (item.key) {
        try {
          await removeStoreCartItem(nonce, item.key, cartToken);
        } catch (e) {
          console.error("SyncStoreCart: Error removing item", item.key, e);
        }
      }
    }
    // Refresh cart after clear
    const fresh = await getStoreCart();
    currentCart = fresh.cart;
  }

  // 2. Add local items sequentially to ensure session stability
  for (const item of localCartItems) {
    console.log('SyncStoreCart: Adding item', item.id, 'q:', item.quantity);
    try {
      currentCart = await addItemToStoreCart(nonce, item.id, item.quantity, cartToken);
    } catch (e) {
      console.error("SyncStoreCart: Failed to add item", item.id, e);
    }
  }

  console.log('SyncStoreCart: Sync complete. Final item count:', currentCart.items_count);
  return currentCart;
}

export async function selectShippingRate(nonce: string, packageId: number | string, rateId: string, cartToken?: string): Promise<StoreCart> {
  const headers: Record<string, string> = {
    'X-WC-Store-API-Nonce': nonce,
    'Content-Type': 'application/json'
  };

  if (cartToken) {
    headers['Cart-Token'] = cartToken;
  }

  const response = await fetch(`${storeApiUrl}/cart/select-shipping-rate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      package_id: packageId,
      rate_id: rateId
    }),
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to select shipping rate: ${response.statusText}`);
  }

  return response.json();
}
