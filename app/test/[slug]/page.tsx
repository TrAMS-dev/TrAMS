import { PortableText, type SanityDocument } from "next-sanity";
import { client } from "@/utils/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { portableTextComponents } from "@/components/Typography";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;


const options = { next: { revalidate: 30 } };

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(POST_QUERY, await params, options);
  const postImageUrl = post.headerImage
    ? urlFor(post.headerImage)?.width(550).height(310).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/test" className="hover:underline">
        ← Back to posts
      </Link>
      {postImageUrl && (

        <Image
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl"
          width={550}
          height={310}
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div>
        <p className="text-gray-600 mb-6">Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {Array.isArray(post.content) && <PortableText value={post.content} components={portableTextComponents} />}
      </div>
    </main>
  );
}