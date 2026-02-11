
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

export async function getWooCommerceOrders(email: string): Promise<any[]> {
  const auth = btoa(`${config.ck}:${config.cs}`);
  const response = await fetch(`https://koonetix.shop/wp-json/wc/v3/orders?email=${email}`, {
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }

  return response.json();
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
