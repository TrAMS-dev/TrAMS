import { Box, Container, Link, Button } from '@chakra-ui/react';
import { PortableText } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { MarkorPage } from '@/types/sanity.types';
import { MARKOR_PAGE_QUERY } from '@/sanity/lib/queries';
import { portableTextComponents, HeroHeading } from '@/components/Typography';
import Gallery from '@/components/Gallery';


export const metadata = {
    title: "Markører | TrAMS",
    description: "Bli med som markør for TrAMS og bidra til realistisk ferdighetstrening for medisinstudenter.",
};

export default async function MarkorerPage() {


    const data = await client.fetch<MarkorPage>(MARKOR_PAGE_QUERY);

    if (!data) {
        return (
            <Container maxW="80%" py={12}>
                <Box textAlign="center">
                    Ingen informasjon tilgjengelig.
                </Box>
            </Container>
        );
    }
    return (
        <>
            <Box
                position="relative"
                h="25vh"
                bgImage='url("https://i.imgur.com/w6QqNvN.jpeg")'
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p={{ base: "2rem 1rem", md: "3rem 1rem" }}
                boxShadow="0 10px 20px rgba(0,0,0,0.3)"
            >
                <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
                <Box position="relative" zIndex={2} maxW="800px" color="var(--color-light)">
                    <HeroHeading fontSize={{ base: "2rem", md: "2.5rem" }}>{data.title.toUpperCase()}</HeroHeading>
                </Box>
                <Box h="10px" bg="var(--color-primary)" mx="auto" mt={4} w='70%' zIndex={2} />

            </Box>
            <Container maxW="80%" py={12}>
                <Box
                    textAlign="center"
                >


                    {data.link && (
                        <Box mb={10}>
                            <Link
                                href={data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                _hover={{ textDecoration: 'none' }}
                            >
                                <Button
                                    bg="var(--color-primary)"
                                    color="white"
                                    _hover={{
                                        bg: 'var(--color-secondary)',
                                        color: 'black',
                                        transform: 'scale(1.02)'
                                    }}
                                    size="lg"
                                    px={8}
                                    h="56px"
                                    fontSize="1.1rem"
                                    borderRadius="md"
                                    transition="all 0.2s"
                                >
                                    Gå til skjema
                                </Button>
                            </Link>
                        </Box>
                    )}
                    <Box className="portable-text" mx="auto" mb={8} textAlign="left">
                        {data.content && <PortableText value={data.content} components={portableTextComponents} />}
                    </Box>



                    {data.gallery && <Gallery images={data.gallery} />}
                </Box>
            </Container >
        </>
    );
}
