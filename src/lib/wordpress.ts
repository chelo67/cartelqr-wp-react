export async function getWordPressPageContent(id: number, token?: string): Promise<string> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://koonetix.shop/wp-json/wp/v2/pages/${id}?context=view`, {
        headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch page: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content.rendered;
}
