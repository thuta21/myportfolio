import useSWR from 'swr';
import { DEVTO_API_URL, DEVTO_USERNAME } from 'data/constants';

const API_URL = '/api/posts/';
const MEDIUM_API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@thutaminthway.dev';

type PostProps = {
  id: string;
  slug: string;
  title: string;
  likes: number;
  views: number;
  createdAt: Date;
  source: string; // new field to track whether the post is from Medium or DEV.to
};

type PostsPayload = {
  dbPosts: PostProps[];
};

async function getPosts(): Promise<PostsPayload> {
  const res = await fetch(API_URL);
  return res.json();
}

export const getDbPosts = () => {
  const { data, error } = useSWR(API_URL, getPosts);

  return {
    dbPosts: data?.dbPosts,
    isLoading: !error && !data,
    isError: error
  };
};

export const getDevtoPosts = async () => {
  const res = await fetch(`${DEVTO_API_URL}/articles?username=${DEVTO_USERNAME}`);

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Error fetching... Status code: ${res.status}, ${res.statusText}`);
  }
  const dev_posts = await res.json();

  return dev_posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    published_at: post.published_at,
    likes: post.public_reactions_count || 0,
    source: 'devto'
  }));
};

export const getMediumPosts = async () => {
  const res = await fetch(MEDIUM_API_URL);
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Error fetching Medium posts... Status code: ${res.status}, ${res.statusText}`);
  }
  const data = await res.json();

  return data.items.map((post) => ({
    slug: post.link.split('?')[0].split('/').pop(),
    title: post.title,
    description: post.description.replace(/<[^>]*>?/gm, '').substring(0, 150),
    published_at: post.pubDate,
    likes: 0, // Medium API doesn't provide likes
    source: 'medium'
  }));
};
