import Image from 'next/image';
import { Box, Flex, Heading } from '@chakra-ui/react';

const Logo = ({
    src,
    alt,
    boxWidth,
    boxHeight,
}: {
    src: string;
    alt: string;
    boxWidth: number;
    boxHeight: number;
}) => (
    <Box position="relative" w={boxWidth} h={boxHeight}>
        <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: 'contain' }}
        />
    </Box>
);

export const PartnersSection = () => {
    return (
        <Box textAlign="center" mb={{ base: 4, md: 8 }}>
            <Heading
                as="h2"
                position="relative"
                color="black"
                pb={2}
                mb={4}
                fontSize="2rem"
            >
                Samarbeidspartnere og søsterforeninger
                <Box
                    display="block"
                    w="120px"
                    h="4px"
                    bg="var(--color-primary)"
                    mx="auto"
                    mt={2}
                    borderRadius="2px"
                />
            </Heading>

            {/* Partners */}
            <Flex flexWrap="wrap" gap={8} justify="center" align="center">
                <Logo src="https://i.imgur.com/6gLu8ff.jpg" alt="Partner 1 logo" boxWidth={120} boxHeight={80} />
                <Logo src="https://i.imgur.com/nzYXh3a.jpg" alt="Partner 2 logo" boxWidth={120} boxHeight={80} />
                <Logo src="https://i.imgur.com/7LEQQKV.jpg" alt="Partner 3 logo" boxWidth={120} boxHeight={80} />
                <Logo src="https://i.imgur.com/kJ1FDvn.jpg" alt="Partner 4 logo" boxWidth={120} boxHeight={80} />
                <Logo src="https://i.imgur.com/2WaPh9I.jpg" alt="Partner 5 logo" boxWidth={120} boxHeight={80} />
                <Logo src="https://i.imgur.com/lfoK4RR.jpg" alt="Partner 6 logo" boxWidth={120} boxHeight={80} />
            </Flex>

            {/* Søsterforeninger */}
            <Box id="sosterforeninger" mt={8}>
                <Flex flexWrap="wrap" gap={8} justify="center" align="center">
                    <Logo src="https://i.imgur.com/Zu9ERQR.jpg" alt="Søsterforening 1" boxWidth={200} boxHeight={150} />
                    <Logo src="https://i.imgur.com/QAgRYfg.jpg" alt="Søsterforening 2" boxWidth={200} boxHeight={150} />
                    <Logo src="https://i.imgur.com/WtxQ0lI.jpg" alt="Søsterforening 3" boxWidth={200} boxHeight={150} />
                    <Logo src="https://i.imgur.com/1BDV2P9.jpg" alt="Søsterforening 4" boxWidth={200} boxHeight={150} />
                </Flex>
            </Box>
        </Box>
    );
}