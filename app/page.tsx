'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Carousel from '@/components/Carousel';
import { Box, Flex, Heading, Text, Container, Button, Link as ChakraLink, HStack } from '@chakra-ui/react';

export default function Home() {
  useEffect(() => {
    const dayDisplay = document.getElementById('day-display');
    const monthYearDisplay = document.getElementById('month-year-display');
    if (dayDisplay && monthYearDisplay) {
      const today = new Date();
      const day = today.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
      const month = monthNames[today.getMonth()];
      const year = today.getFullYear();
      dayDisplay.textContent = day.toString();
      monthYearDisplay.textContent = `${month} ${year}`;
    }
  }, []);

  const scrollToAbout = () => {
    const target = document.getElementById('om-oss');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const carouselSlides = [
    {
      backgroundImage: 'https://imgur.com/rKhkGGT.jpg',
      title: 'TrAMS, Trondheim Akuttmedisinske Studentforening',
      description:
        'Vi er en ideell organisasjon, av og for medisinstudenter i Trondheim, basert på frivillighet. Foreningens hovedformål er å tydeliggjøre viktigheten av faglig kompetanse innenfor akuttmedisin, både for kommende leger og andre.',
      buttonText: 'Klikk for å lese mer om oss!',
      onClick: scrollToAbout,
    },
    {
      backgroundImage: 'https://i.imgur.com/521F3ik.jpg',
      title: 'Ny medisinstudent i Trondheim',
      description:
        'TrAMS er studentforeningen for medisinstudenter ved NTNU som er interesserte i akuttmedisin! Som medlem kan du blant annet delta på TrAMS-arrangementer forbeholdt medlemmer, du får gratis ferdighetskurs og muligheten til å delta på vår generalforsamling.',
      buttonText: 'Klikk her for å bli medlem',
      link: '/for-medisinstudenter',
    },
    {
      backgroundImage: 'https://imgur.com/FCUWJQ8.jpg',
      title: 'Ønsker du å bli Instruktør?',
      description:
        'Som instruktør får du muligheten til å lære bort akuttmedisin på både eksterne og interne kurs. I tillegg blir man prioritert på noen av TrAMS sine antallsbegrensede arrangementer. Som instruktør får man ta del i et sosialt og hyggelig instruktørmiljø!',
      buttonText: 'Klikk her for å lese om hvordan man kan bli instruktør i TrAMS',
      link: '/instruktorer',
    },
  ];

  const boardMembers = [
    { name: 'Celestin Alfonso', role: 'Styreleder', image: 'https://imgur.com/fHeRmAi.jpg', link: '#' },
    { name: 'Thea Glende', role: 'Fagansvarlig', image: 'https://imgur.com/sHv5zlA.jpg', link: '#' },
    { name: 'Oskar Brennersted', role: 'Internsjef', image: 'https://imgur.com/td3X62G.jpg', link: '#' },
    { name: 'Didrik Monstad-Thorvaldsen', role: 'Eksternsjef', image: 'https://imgur.com/6XMjF0s.jpg', link: '#' },
    { name: 'Ruiyi Li', role: 'Komiteansvarlig', image: 'https://imgur.com/mikgv4t.jpg', link: '#' },
    { name: 'Ronald Dadzie', role: 'Instruktøransvarlig', image: 'https://imgur.com/IcS6SFq.jpg', link: '#' },
    { name: 'Mari Ravlo-Caspersen', role: 'Økonomiansvarlig', image: 'https://imgur.com/m16O0aZ.jpg', link: '#' },
    { name: 'Magnus Heier Skauby', role: 'Internkordinator', image: 'https://imgur.com/E55D1Vf.jpg', link: '#' },
    { name: 'Eirik Vikan Trettenes', role: 'Eksternkordinator', image: 'https://imgur.com/NsqHN1H.jpg', link: '#' },
    { name: 'Anna Eker Christoffersen', role: 'Markøransvarlig', image: 'https://imgur.com/qgkaR0a.jpg', link: '#' },
    { name: 'Emilie Nora Einvik', role: 'Markedsføringsansvarlig', image: 'https://imgur.com/gMnTyAG.jpg', link: '#' },
    { name: 'Martin Larsen', role: 'Sponsoransvarlig', image: 'https://imgur.com/UCjJjrX.jpg', link: '#' },
    { name: 'Brage Leiner', role: 'Utstyransvarlig', image: 'https://imgur.com/u61QQ1x.jpg', link: '#' },
    { name: 'Markus Helbæk', role: 'Sekretær', image: 'https://imgur.com/yumfv1D.jpg', link: '#' },
    { name: 'Bergitte Vedøy', role: 'Mentorleder', image: 'https://imgur.com/CnvLhZf.jpg', link: '#' },
  ];

  return (
    <>
      <Carousel slides={carouselSlides} />

      {/* HERO-COURSES */}
      <Flex justify="center" flexWrap="wrap" gap={{ base: 4, md: 8 }} my={{ base: 4, md: 8 }}>
        <Link
          href="/forstehjelpskurs"
          className="min-h-[150px] bg-white rounded-lg min-w-[400px] text-center text-lg block no-underline transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:-translate-y-1 p-6"
        >
          <Heading as="h2" position="relative" mt={0} mb={4} color="black" pt={6} pb={2} fontSize="1.5rem">
            Book førstehjelpskurs
            <Box display="block" w="80px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
          </Heading>
          <Text fontSize="1rem" color="black">For bedrift eller forening</Text>
        </Link>
        <Link
          href="/for-medisinstudenter"
          className="min-h-[150px] bg-white rounded-lg min-w-[400px] text-center text-lg block no-underline transition-transform duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:-translate-y-1 p-6"
        >

          <Heading as="h2" position="relative" mt={0} mb={4} color="black" pt={6} pb={2} fontSize="1.5rem">
            Internkurs for studenter
            <Box display="block" w="80px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
          </Heading>
          <Text fontSize="1rem" color="black">For medisinstudenter</Text>
        </Link>
      </Flex>

      {/* Info-section: about + calendar */}
      <Container maxW={{ base: "95%", md: "60%" }} p={0}>
        <Flex flexDirection="column" align="flex-start" gap={{ base: 4, md: 8 }} maxW="1200px" mx="auto" my={{ base: 4, md: 8 }} bg="var(--color-altBg)" p={{ base: 4, md: 4 }} borderRadius="8px">
          <Box
            id="om-oss"
            flex="1 1 auto"
            minW="300px"
            bg="white"
            borderRadius="8px"
            p={{ base: 4, md: 4 }}
            boxShadow="0 0 10px rgba(0,0,0,0.1)"
          >
            <Heading
              as="h2"
              textAlign="center"
              mb={4}
              position="relative"
              color="black"
              pb={2}
              fontSize="1.8rem"
            >
              Trondheim Akuttmedisinske Studentforening
              <Box display="block" w="80px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
            </Heading>
            <Flex flexWrap="wrap" gap={4} align="flex-start">
              <Box flex="1 1 300px">
                <Text mb={4}>
                  <Box as="span" float="right" ml={4}>
                    <Image
                      src="https://imgur.com/jZBTHbd.png"
                      alt="TrAMS logo"
                      width={100}
                      height={100}
                      className="max-w-[100px]"
                    />
                  </Box>
                  Trondheim akuttmedisinske studentforening (TrAMS), stiftet 7. mai 2009, er en ideell organisasjon av og
                  for medisinstudenter i Trondheim, basert på frivillighet.
                </Text>
                <Text mb={4}>
                  Vi legger vekt på faglig kompetanse innen akuttmedisin for både kommende leger og lekfolk. Vårt mål er
                  å skape trygghet rundt håndtering av akuttmedisinske situasjoner ved å fremme interesse, engasjement
                  og styrke kunnskapen gjennom kvalitetssikrede kurs og ferdighetstrening.
                </Text>
                <Text mb={4}>
                  Foreningen deltar aktivt i det norske og skandinaviske studentmiljøet innen akuttmedisin gjennom NAMS
                  - Norsk Akuttmedisinsk Studentforum.
                </Text>
                <ChakraLink
                  href="https://docs.google.com/document/d/1_7nyWf8L9BqeWGN4BpRjt4MkJSTiws3RvJJrkYDMQwo/edit?tab=t.0"
                  as={Button}
                  bg="var(--color-primary)"
                  color="white"
                  mt={4}
                  _hover={{ boxShadow: '0 0 25px rgba(0,0,0,0.3)' }}
                >
                  Vedtekter
                </ChakraLink>
              </Box>
            </Flex>
          </Box>

          <Box
            flex="1 1 400px"
            minW="300px"
            width="full"
            bg="white"
            borderRadius="8px"
            p={{ base: 4, md: 4 }}
            display="flex"
            flexDirection="column"
            gap={4}
            boxShadow="0 0 10px rgba(0,0,0,0.1)"
          >
            <Flex gap={4} flexWrap="wrap">
              <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start" minW="200px">
                <Box
                  bg="var(--color-secondary)"
                  color="black"
                  p={2}
                  borderRadius="4px"
                  textAlign="center"
                  mb={2}
                >
                  <Text id="day-display" fontSize="1.5rem" display="block" fontWeight="bold"></Text>
                  <Text id="month-year-display" fontSize="0.9rem"></Text>
                  <Text fontSize="0.7rem" m={0} textAlign="left">Studentkalender</Text>
                </Box>
              </Box>
              <Box
                flex={2}
                bg="white"
                borderRadius="8px"
                overflow="hidden"
                position="relative"
                minW="300px"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  bg="var(--color-primary)"
                  h="5px"
                  w="100%"
                />
                <iframe
                  className="border-none h-[400px] w-full"
                  src="https://calendar.google.com/calendar/embed?src=c_e561ac20ed81465fce5b8050b5e77c2deae77ebd486c10c45c53092d146bd83d%40group.calendar.google.com&ctz=Europe%2FOslo&mode=MONTH"
                  frameBorder="0"
                  scrolling="no"
                />
              </Box>
            </Flex>
          </Box>
        </Flex>

        {/* Cooperation partners */}
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
            <Box display="block" w="120px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
          </Heading>
          <Flex flexWrap="wrap" gap={8} justify="center" align="center">
            <Image src="https://i.imgur.com/6gLu8ff.jpg" alt="Partner 1 logo" width={120} height={80} className="max-h-[80px] object-contain" />
            <Image src="https://i.imgur.com/nzYXh3a.jpg" alt="Partner 2 logo" width={120} height={80} className="max-h-[80px] object-contain" />
            <Image src="https://i.imgur.com/7LEQQKV.jpg" alt="Partner 3 logo" width={120} height={80} className="max-h-[80px] object-contain" />
            <Image src="https://i.imgur.com/kJ1FDvn.jpg" alt="Partner 4 logo" width={120} height={80} className="max-h-[80px] object-contain" />
            <Image src="https://i.imgur.com/2WaPh9I.jpg" alt="Partner 5 logo" width={120} height={80} className="max-h-[80px] object-contain" />
            <Image src="https://i.imgur.com/lfoK4RR.jpg" alt="Partner 6 logo" width={120} height={80} className="max-h-[80px] object-contain" />
          </Flex>
          <Box id="sosterforeninger" mt={8}>
            <Flex flexWrap="wrap" gap={8} justify="center" align="center">
              <Image src="https://imgur.com/Zu9ERQR.jpg" alt="Søsterforening 1" width={200} height={150} className="max-h-[150px] object-contain" />
              <Image src="https://imgur.com/QAgRYfg.jpg" alt="Søsterforening 2" width={200} height={150} className="max-h-[150px] object-contain" />
              <Image src="https://imgur.com/WtxQ0lI.jpg" alt="Søsterforening 3" width={200} height={150} className="max-h-[150px] object-contain" />
              <Image src="https://imgur.com/1BDV2P9.jpg" alt="Søsterforening 4" width={200} height={150} className="max-h-[150px] object-contain" />
            </Flex>
          </Box>
        </Box>

        {/* Join us section */}
        <Box
          my={{ base: 4, md: 8 }}
          mx="auto"
          borderRadius="25px"
          textAlign="center"
          p={{ base: 4, md: 8 }}
          bg="var(--color-primary)"
          color="white"
          maxW="1200px"
        >
          <Heading as="h2" mb={4} fontSize="2rem">Bli med på laget som samarbeidspartner</Heading>
          <Text mb={4} lineHeight="1.6">
            Vi er alltid på jakt etter støtte eller nye samarbeidspartnere. Kjenner du noen som er interessert i å bli
            bedre kjent med oss?
            <br />
            <br />
            I Trondheim har foreningen en solid plassering i studentmiljøet. Vi samarbeider tett med Fakultet for
            medisin og helsevitenskap ved NTNU om å gjennomføre kurs for nye studenter i basal akuttmedisin. I tillegg
            samarbeider vi med bl.a. anestesiavdelingen ved St. Olavs hospital om å tilby det som på studiet kalles
            frivillig uketjeneste, en lærerik hospiteringsordning. Leger ved luftambulansen i Trondheim har også stilt
            opp for å holde foredrag o.l. for studenter ved flere anledninger. Vi har gjennomført arrangementer der vi
            har koordinert øvelser sammen med Redningstjenesten 330 skvadron, Redningsselskapet, Trøndelag brann- og
            redningstjeneste, Trøndelag politidistrikt. Sist, men ikke minst, har Sør-Trøndelag ambulansetjeneste vært
            en kjempemessig støttespiller for oss.
            <br />
            <br />
            Vi ønsker å takke alle som bidrar til å hjelpe oss i arbeidet for å fremme interesse og kunnskap rundt
            akuttmedisin! Ønsker du å støtte arbeidet vårt? Ta kontakt med{' '}
            <ChakraLink href="mailto:sponsoransvarlig@trams.no" color="var(--color-secondary)" textDecoration="underline">
              sponsoransvarlig@trams.no
            </ChakraLink>
            .
          </Text>
          <ChakraLink
            href="#"
            as={Button}
            bg="var(--color-secondary)"
            color="black"
            mt={4}
            _hover={{ bg: 'var(--color-alternate)' }}
          >
            Ønsker du å vite mer om hva vi har gjort? Trykk for å se oss i media
          </ChakraLink>
        </Box>

        {/* Styret-section */}
        <Box bg="white" borderRadius="8px" mb={{ base: 4, md: 8 }} p={{ base: 4, md: 8 }}>
          <Heading
            as="h2"
            textAlign="center"
            mb={8}
            color="black"
            fontWeight={700}
            position="relative"
            pb={2}
            fontSize="2rem"
          >
            Styret i TrAMS
            <Box display="block" w="80px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
          </Heading>
          <HStack
            gap={8}
            overflowX="auto"
            pb={8}
            pt={8}
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {boardMembers.map((member, index) => (
              <ChakraLink
                key={index}
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                bg="white"
                borderRadius="8px"
                p={4}
                w="240px"
                textAlign="center"
                transition="all 0.3s ease"
                flex="0 0 auto"
                style={{ scrollSnapAlign: 'start' }}
                textDecoration="none"
                color="inherit"
                boxShadow="0 0 10px rgba(0,0,0,0.1)"
                _hover={{ transform: 'scale(1.05)', boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-full mb-2"
                />
                <Heading as="h3" m={0} mb={2} fontSize="1rem" fontWeight={600} wordBreak="break-word" hyphens="auto">
                  {member.name}
                </Heading>
                <Text m={0} fontSize="0.9rem" color="#666" wordBreak="break-word">
                  {member.role}
                </Text>
              </ChakraLink>
            ))}
          </HStack>
        </Box>
      </Container>
    </>
  );
}
