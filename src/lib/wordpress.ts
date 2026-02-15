export interface WPPost {
    id: number;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    slug: string;
    link: string;
    date: string;
    _embedded?: {
        'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text: string;
        }>;
    };
}

export async function getWordPressPosts(): Promise<WPPost[]> {
    const response = await fetch(`https://koonetix.shop/wp-json/wp/v2/posts?_embed&per_page=12`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return await response.json();
}

export async function getWordPressPostBySlug(slug: string): Promise<WPPost | null> {
    const response = await fetch(`https://koonetix.shop/wp-json/wp/v2/posts?_embed&slug=${slug}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
}

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
